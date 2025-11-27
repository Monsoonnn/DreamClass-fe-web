import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, InputNumber, Row, Col, Image } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getRewardByKey } from './RewardService';
import RewardEditModal from './RewardEditModal';

const { Option } = Select;

export default function RewardDetail() {
  const [form] = Form.useForm();
  const [reward, setReward] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();
  const { key } = useParams(); // lấy key từ URL

  useEffect(() => {
    const data = getRewardByKey(key);
    if (data) {
      setReward(data);
      setPreviewImage(data.image);
      form.setFieldsValue({
        rewardCode: data.rewardCode,
        rewardName: data.rewardName,
        category: data.category,
        quantity: data.quantity,
        condition: data.condition,
        note: data.note,
      });
    }
  }, [key, form]);

  if (!reward) return <div>Không tìm thấy phần thưởng</div>;

  return (
    <div className="bg-white shadow-lg p-5 rounded-md max-w-4xl mx-auto mt-5">
      <h2 className="text-lg font-semibold mb-4">Chi tiết phần thưởng</h2>
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          {/* Cột trái */}
          <Col span={12}>
            <Form.Item label="Mã phần thưởng" name="rewardCode">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Tên phần thưởng" name="rewardName">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Phân loại" name="category">
              <Select disabled>
                <Option value="Huy hiệu">Huy hiệu</Option>
                <Option value="Tiền tệ">Tiền tệ</Option>
                <Option value="Danh hiệu">Danh hiệu</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Số lượng" name="quantity">
              <InputNumber min={1} style={{ width: '100%' }} readOnly />
            </Form.Item>
            <Form.Item label="Điều kiện nhận" name="condition">
              <Input.TextArea rows={3} readOnly />
            </Form.Item>
          </Col>

          {/* Cột phải */}
          <Col span={12}>
            <Form.Item label="Hình ảnh phần thưởng">
              {previewImage && <Image src={previewImage} alt="reward" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} preview={false} />}
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} readOnly />
            </Form.Item>
          </Col>
        </Row>

        {/* Nút cập nhật / quay lại */}
        <Form.Item className="flex gap-2 mt-4">
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Cập nhật
          </Button>

          <Button type="default" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Form.Item>
      </Form>
      <RewardEditModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        reward={reward}
        onUpdate={() => {
          const updated = getRewardByKey(key);
          setReward(updated);
          setPreviewImage(updated.image);
        }}
      />
    </div>
  );
}
