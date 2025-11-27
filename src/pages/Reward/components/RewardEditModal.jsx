import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, InputNumber, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateReward } from './RewardService';

const { Option } = Select;

export default function RewardEditModal({ visible, onClose, reward, onUpdate }) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);

  const maxSizeMB = 1;

  useEffect(() => {
    if (reward) {
      form.setFieldsValue({
        rewardCode: reward.rewardCode,
        rewardName: reward.rewardName,
        category: reward.category,
        quantity: reward.quantity,
        condition: reward.condition,
        note: reward.note,
      });
      setPreviewImage(reward.image || null);
      setFileList(reward.image ? [{ uid: '-1', name: 'image', status: 'done', url: reward.image }] : []);
    }
  }, [reward, form]);

  const handleUploadChange = ({ file, fileList }) => {
    const currentFile = file.originFileObj || file;
    if (!currentFile) return;

    if (currentFile.size / 1024 / 1024 > maxSizeMB) {
      message.error(`Dung lượng tối đa là ${maxSizeMB}MB`);
      return;
    }

    setFileList(fileList);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(currentFile);
  };

  const onFinish = (values) => {
    if (!previewImage) {
      message.error('Vui lòng tải lên ảnh phần thưởng');
      return;
    }

    const updatedReward = {
      ...reward,
      rewardCode: values.rewardCode,
      rewardName: values.rewardName,
      category: values.category,
      quantity: values.quantity,
      condition: values.condition,
      note: values.note,
      image: previewImage,
    };

    updateReward(reward.key, updatedReward);
    message.success('Cập nhật phần thưởng thành công!');
    onUpdate(); // callback để reload data ở parent
    onClose(); // đóng modal
  };

  return (
    <Modal title="Chỉnh sửa phần thưởng" visible={visible} onCancel={onClose} footer={null} width={800}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          {/* Cột trái */}
          <Col span={12}>
            <Form.Item label="Mã phần thưởng" name="rewardCode" rules={[{ required: true, message: 'Vui lòng nhập mã phần thưởng' }]}>
              <Input placeholder="Nhập mã phần thưởng" />
            </Form.Item>
            <Form.Item label="Tên phần thưởng" name="rewardName" rules={[{ required: true, message: 'Vui lòng nhập tên phần thưởng' }]}>
              <Input placeholder="Nhập tên phần thưởng" />
            </Form.Item>
            <Form.Item label="Phân loại" name="category" rules={[{ required: true, message: 'Vui lòng chọn phân loại' }]}>
              <Select placeholder="Chọn phân loại">
                <Option value="Huy hiệu">Huy hiệu</Option>
                <Option value="Tiền tệ">Tiền tệ</Option>
                <Option value="Danh hiệu">Danh hiệu</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Điều kiện nhận" name="condition" rules={[{ required: true, message: 'Vui lòng nhập điều kiện nhận' }]}>
              <Input.TextArea placeholder="Nhập điều kiện nhận" rows={3} />
            </Form.Item>
          </Col>

          {/* Cột phải */}
          <Col span={12}>
            <Form.Item label="Tải hình ảnh phần thưởng">
              <Upload listType="picture" beforeUpload={() => false} fileList={fileList} onChange={handleUploadChange} maxCount={1} accept="image/*">
                <Button icon={<UploadOutlined />}>Tải ảnh lên (tối đa {maxSizeMB}MB)</Button>
              </Upload>
              {previewImage && <img src={previewImage} alt="preview" style={{ marginTop: 10, width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />}
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Nhập ghi chú (nếu có)" rows={3} />
            </Form.Item>
          </Col>
        </Row>

        {/* Nút lưu / hủy */}
        <Form.Item className="flex gap-2 mt-4">
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
          <Button type="default" onClick={onClose}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
