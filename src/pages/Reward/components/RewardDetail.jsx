import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Image, Spin, message, Breadcrumb, Descriptions } from 'antd';
import { GiftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

import RewardEditModal from './RewardEditModal';
import apiClient from '../../../services/api';

export default function ItemDetail() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const mappedReward = item
    ? {
        rewardCode: item.itemId,
        rewardName: item.name,
        category: item.type,
        quantity: item.quantity || 1,
        condition: item.description,
        note: item.notes,
        image: item.image,
      }
    : null;

  const navigate = useNavigate();
  const { itemId } = useParams();

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/items/admin/${itemId}`);
      setItem(res.data.data);
    } catch (err) {
      message.error('Không thể tải dữ liệu vật phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!item) {
    return <div>Không tìm thấy vật phẩm</div>;
  }

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/item-mana',
            title: (
              <>
                <GiftOutlined />
                <span className="ml-1 font-semibold text-[#23408e]">Quản lý phần thưởng</span>
              </>
            ),
          },
          {
            title: (
              <>
                <InfoCircleOutlined />
                <span className="ml-1">Thông tin phần thưởng</span>
              </>
            ),
          },
        ]}
      />

      {/* Content */}
      <div className="bg-white shadow-lg p-6 rounded-md max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chi tiết vật phẩm</h2>
        </div>

        <Row gutter={24}>
          {/* Left */}
          <Col span={12}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Mã vật phẩm">{item.itemId}</Descriptions.Item>

              <Descriptions.Item label="Tên vật phẩm">{item.name}</Descriptions.Item>

              <Descriptions.Item label="Loại">
                {item.type === 'banner' && 'Cờ hiệu'}
                {item.type === 'title' && 'Danh hiệu'}
                {item.type === 'empty' && 'Khác'}
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả">{item.description || '—'}</Descriptions.Item>
              {/* <Descriptions.Item label="Số lượng">{item.quantity || '_'}</Descriptions.Item> */}
              <Descriptions.Item label="Ghi chú">{item.notes || '—'}</Descriptions.Item>
            </Descriptions>
          </Col>

          {/* Right */}
          <Col span={12}>
            <Image
              src={item.image}
              alt="item"
              width="100%"
              height={240}
              style={{
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </Col>
        </Row>

        <div className="flex mt-2 gap-1">
          <Button danger type="default" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button type="primary" onClick={() => setEditModalVisible(true)}>
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Edit modal */}
      <RewardEditModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} reward={mappedReward} onUpdate={fetchItem} />
    </div>
  );
}
