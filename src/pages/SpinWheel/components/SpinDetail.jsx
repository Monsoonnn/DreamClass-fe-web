import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Table, Spin, message, Button, Typography, Row, Col, Statistic, Breadcrumb } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CalendarOutlined, DollarCircleOutlined, EditOutlined, GiftOutlined, UnorderedListOutlined, ClockCircleOutlined, HomeOutlined } from '@ant-design/icons';
import apiClient from '../../../services/api';

const { Title, Text } = Typography;

export default function SpinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spinData, setSpinData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpinDetail = async () => {
      try {
        setLoading(true);
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!spinData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-screen bg-gray-50">
        <Title level={4} type="secondary">
          Không tìm thấy dữ liệu vòng quay
        </Title>
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/spin-mana')} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const itemsColumns = [
    {
      title: 'Mã vật phẩm',
      dataIndex: 'itemId',
      key: 'itemId',
      align: 'center',
      render: (text) => <Text copyable>{text}</Text>, // Cho phép copy ID tiện lợi
    },
    {
      title: 'Tỉ lệ trúng',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      render: (rate) => <span className="font-semibold text-blue-600">{(rate * 100).toFixed(2)}%</span>,
    },
    // {
    //   title: 'Phân loại',
    //   dataIndex: 'isRare',
    //   key: 'isRare',
    //   align: 'center',
    //   render: (isRare) =>
    //     isRare ? (
    //       <Tag color="error" className="px-3 py-1 uppercase text-xs font-bold">
    //         Hiếm
    //       </Tag>
    //     ) : (
    //       <Tag color="default" className="px-3 py-1 uppercase text-xs">
    //         Thường
    //       </Tag>
    //     ),
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Header Section */}
      <div className="l mx-auto  flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Breadcrumb
            className="mb-4 text-sm"
            items={[
              {
                href: '/spin-mana',
                title: (
                  <>
                    <HomeOutlined />
                    <span className="font-semibold text-[#23408e]">Quản lý vòng quay</span>
                  </>
                ),
              },
              {
                title: (
                  <>
                    <UnorderedListOutlined />
                    <span>Thông tin vòng quay</span>
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto ">
        {/* Info Card */}
        <Card bordered={false} className="shadow-sm rounded-none overflow-hidden" bodyStyle={{ padding: 0 }}>
          <div className="p-2 border-b border-gray-100 flex items-center justify-between bg-white">
            <div>
              {spinData.isActive ? (
                <Tag color="success" className="px-3 py-1 text-sm rounded-full border-0">
                  ● Đang hoạt động
                </Tag>
              ) : (
                <Tag color="error" className="px-3 py-1 text-sm rounded-full border-0">
                  ● Ngừng hoạt động
                </Tag>
              )}
            </div>

            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/spin-mana/edit/${id}`)} className="rounded-md">
              Chỉnh sửa
            </Button>
          </div>

          <div className="p-2">
            {/* Sử dụng Row/Col để tạo highlight cho các chỉ số quan trọng */}
            <Row gutter={[24, 24]} className="mb-2">
              <Col xs={24} sm={8}>
                <Card bordered={false} className="bg-blue-50/50 rounded-none text-center">
                  <Statistic
                    title={
                      <span className="text-gray-500 text-sm">
                        <DollarCircleOutlined /> Giá quay
                      </span>
                    }
                    value={spinData.spinPrice}
                    suffix={spinData.currency || 'Xu'}
                    valueStyle={{ color: '#1677ff', fontWeight: 600 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} className="bg-green-50/50 rounded-none text-center">
                  <Statistic
                    title={
                      <span className="text-gray-500 text-sm">
                        <CalendarOutlined /> Bắt đầu
                      </span>
                    }
                    value={spinData.startTime ? new Date(spinData.startTime).toLocaleDateString('vi-VN') : '--'}
                    valueStyle={{ fontSize: '1.2rem', fontWeight: 500 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} className="bg-orange-50/50 rounded-none text-center">
                  <Statistic
                    title={
                      <span className="text-gray-500 text-sm">
                        <ClockCircleOutlined /> Kết thúc
                      </span>
                    }
                    value={spinData.endTime ? new Date(spinData.endTime).toLocaleDateString('vi-VN') : '--'}
                    valueStyle={{ fontSize: '1.2rem', fontWeight: 500 }}
                  />
                </Card>
              </Col>
            </Row>

            <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} size="middle" labelStyle={{ width: '150px', backgroundColor: '#fafafa', color: '#666' }}>
              <Descriptions.Item label="Tên vòng quay" span={2}>
                <span className="font-medium text-gray-800">{spinData.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                <span className="text-gray-600 whitespace-pre-wrap">{spinData.description || <span className="italic text-gray-400">Không có mô tả</span>}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian ">
                <div className="flex flex-col text-xs text-gray-500">
                  <span>
                    <b>Bắt đầu:</b> {spinData.startTime ? new Date(spinData.startTime).toLocaleString('vi-VN') : '-'}
                  </span>
                  <span>
                    <b>Kết thúc:</b> {spinData.endTime ? new Date(spinData.endTime).toLocaleString('vi-VN') : '-'}
                  </span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>

        {/* Items Table Card */}
        <Card
          bordered={false}
          className="shadow-sm rounded-none"
          title={
            <div className="flex items-center gap-2">
              <GiftOutlined className="text-purple-500" />
              <span>Danh sách vật phẩm ({spinData.items?.length || 0})</span>
            </div>
          }
        >
          <Table
            dataSource={spinData.items || []}
            columns={itemsColumns}
            rowKey={(record) => record.itemId || Math.random()}
            pagination={false}
            bordered
            size="middle"
            locale={{ emptyText: 'Chưa có vật phẩm nào được thiết lập' }}
            scroll={{ x: 600 }}
          />
        </Card>
        <div></div>
      </div>
    </div>
  );
}
