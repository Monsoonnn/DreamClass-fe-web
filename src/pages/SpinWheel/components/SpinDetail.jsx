import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Table, Spin, message, Button, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import apiClient from '../../../services/api';

export default function SpinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spinData, setSpinData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpinDetail = async () => {
      try {
        setLoading(true);
        // Assuming GET /spin-wheels/:id returns the details
        const res = await apiClient.get(`/spin-wheels/${id}`);
        setSpinData(res.data.data || res.data);
      } catch (error) {
        console.error('Error fetching spin detail:', error);
        message.error('Không thể tải thông tin vòng quay!');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpinDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!spinData) {
    return <div className="p-4">Không tìm thấy dữ liệu vòng quay.</div>;
  }

  const itemsColumns = [
    {
      title: 'Item ID',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: 'Tỉ lệ (Rate)',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => `${(rate * 100).toFixed(2)}%`,
    },
    {
      title: 'Hiếm',
      dataIndex: 'isRare',
      key: 'isRare',
      render: (isRare) => (isRare ? <Tag color="red">Hiếm</Tag> : <Tag color="default">Thường</Tag>),
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/spin-mana')} 
        className="mb-4"
      >
        Quay lại danh sách
      </Button>

      <Card title={`Chi tiết vòng quay: ${spinData.name}`} bordered={false} className="shadow-md">
        <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold', width: '200px' }}>
          <Descriptions.Item label="Tên vòng quay">{spinData.name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{spinData.description || 'Không có mô tả'}</Descriptions.Item>
          <Descriptions.Item label="Giá quay">
            <Tag color="green">{spinData.spinPrice} {spinData.currency}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian bắt đầu">
            {spinData.startTime ? new Date(spinData.startTime).toLocaleString('vi-VN') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian kết thúc">
            {spinData.endTime ? new Date(spinData.endTime).toLocaleString('vi-VN') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {spinData.isActive ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Danh sách vật phẩm trong vòng quay</Divider>

        <Table
          dataSource={spinData.items || []}
          columns={itemsColumns}
          rowKey={(record) => record.itemId || Math.random()} // Fallback key
          pagination={false}
          bordered
          size="small"
        />
      </Card>
    </div>
  );
}
