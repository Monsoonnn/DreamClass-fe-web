import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Image, Spin, message, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../../services/api';

const { Option } = Select;

export default function ItemDetail() {
  const [form] = Form.useForm();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { itemId } = useParams();

  const fetchItem = async () => {
    try {
      const res = await apiClient.get(`/items/admin/${itemId}`);
      const data = res.data.data;

      setItem(data);
      form.setFieldsValue({
        itemId: data.itemId,
        name: data.name,
        type: data.type,
        description: data.description,
        notes: data.notes,
      });
    } catch (err) {
      message.error('Không thể tải dữ liệu vật phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  if (loading) return <Spin className="mt-10" />;
  if (!item) return <div>Không tìm thấy vật phẩm</div>;

  return (
    <div className="p-4">
      <div>
        <Breadcrumb
          className="mb-4 text-sm"
          items={[
            {
              href: '/item-mana',
              title: (
                <>
                  <HomeOutlined />
                  <span className="font-semibold text-[#23408e]">Quản lý phần thưởng</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <UnorderedListOutlined />
                  <span>Thông tin phần thưởng</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="bg-white shadow-lg p-5 rounded-md max-w-4xl mx-auto mt-5">
        <h2 className="text-lg font-semibold mb-4">Chi tiết vật phẩm</h2>

        <Form form={form} layout="vertical">
          <Row gutter={24}>
            {/* Cột trái */}
            <Col span={12}>
              <Form.Item label="Mã vật phẩm" name="itemId">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Tên vật phẩm" name="name">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Loại" name="type">
                <Select disabled>
                  <Option value="title">Danh hiệu</Option>
                  <Option value="badge">Huy hiệu</Option>
                  <Option value="currency">Tiền tệ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={3} readOnly />
              </Form.Item>
            </Col>

            {/* Cột phải */}
            <Col span={12}>
              <Form.Item label="Hình ảnh vật phẩm">
                <Image
                  src={item.image}
                  alt="item"
                  style={{
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                  preview={false}
                />
              </Form.Item>

              <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea rows={3} readOnly />
              </Form.Item>
            </Col>
          </Row>

          {/* Nút quay lại */}
          <Form.Item className="flex gap-2 mt-4">
            <Button type="default" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
