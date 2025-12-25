import React, { useEffect, useState } from 'react';
import { Card, Spin, Row, Col, Tag } from 'antd';
import apiClient from '../../../services/api';

export default function StudyAchievements() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // Fetch achievements / inventory
  const fetchData = async () => {
    try {
      const res = await apiClient.get('/items/inventory/my');
      return res.data.data || [];
    } catch (err) {
      console.error('Error loading achievements:', err);
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchData();
      setItems(data);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <Card title="Danh hiệu & Thành tích đạt được" className="shadow" loading={loading}>
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-6">Học sinh chưa có thành tích nào.</div>
        ) : (
          <Row gutter={[16, 16]}>
            {items.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                <Card hoverable className="rounded shadow-sm" cover={<img alt={item.itemDetails?.name} src={item.itemDetails?.image} className="w-full h-36 object-contain p-4" />}>
                  <Card.Meta
                    title={<div className="font-semibold text-sm text-[#23408e]">{item.itemDetails?.name}</div>}
                    description={
                      <div className="text-sm mt-2 text-gray-600 space-y-1">
                        {/* <div>
                          <b>Mã vật phẩm:</b> {item.itemId}
                        </div> */}

                        <div className="text-sm">
                          <b>Ngày nhận:</b> {new Date(item.obtainedDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-gray-500 italic">{item.itemDetails?.description}</div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </div>
  );
}
