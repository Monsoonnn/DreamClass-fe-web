import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, InputNumber, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import apiClient from '../../../services/api';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

const { Option } = Select;

export default function RewardEditModal({ visible, onClose, reward, onUpdate }) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

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
      // Don't pre-fill fileList to avoid re-uploading the URL as a file if not changed
      setFileList([]);
    }
  }, [reward, form]);

  const handleUploadChange = ({ file, fileList }) => {
    const currentFile = file.originFileObj || file;
    if (!currentFile) return;

    if (currentFile.size / 1024 / 1024 > maxSizeMB) {
      showError(`Dung lượng tối đa là ${maxSizeMB}MB`);
      return;
    }

    setFileList(fileList);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(currentFile);
  };

  const onFinish = async (values) => {
    showLoading();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('itemId', values.rewardCode);
      formData.append('name', values.rewardName);
      formData.append('type', values.category);
      formData.append('description', values.condition || '');
      formData.append('notes', values.note || '');
      // Quantity is in customFields for some implementations, check AddReward logic.
      // AddReward doesn't seem to send quantity explicitly in FormData?
      // Wait, AddReward.jsx didn't send quantity in FormData?
      // AddReward.jsx: initialValues={{ quantity: 1 }}. Form has quantity.
      // But in onFinish: formData.append(...) does NOT include quantity!
      // This might be a bug in AddReward too if quantity is needed.
      // However, RewardTable reads item.customFields?.quantity.
      // So backend might put it in customFields or we need to send it.
      // I'll append it.
      formData.append('quantity', values.quantity);

      // Image
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      // We use the original key (which might be _id) or rewardCode for the update endpoint
      // Typically PUT /items/admin/:id or /items/admin/:itemId
      // RewardTable uses `item.rewardCode` for handleDelete.
      // Let's assume endpoint uses itemId (rewardCode).
      const id = reward.key || reward.rewardCode; // key was _id in Table mapping

      // Wait, Table: key: item._id, rewardCode: item.itemId.
      // Delete uses /items/admin/${itemId}.
      // So update should probably use /items/admin/${itemId}.
      // But if we CHANGE rewardCode (itemId), the URL might need old ID.
      // Assuming itemId is unique key.

      await apiClient.put(`/items/admin/${reward.rewardCode}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      closeLoading();
      showSuccess('Cập nhật phần thưởng thành công!');
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      closeLoading();
      showError('Cập nhật thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Chỉnh sửa phần thưởng" open={visible} onCancel={onClose} footer={null} width={800} confirmLoading={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          {/* Cột trái */}
          <Col span={12}>
            <Form.Item label="Mã phần thưởng" name="rewardCode" rules={[{ required: true, message: 'Vui lòng nhập mã phần thưởng' }]}>
              <Input placeholder="Nhập mã phần thưởng" disabled />
            </Form.Item>
            <Form.Item label="Tên phần thưởng" name="rewardName" rules={[{ required: true, message: 'Vui lòng nhập tên phần thưởng' }]}>
              <Input placeholder="Nhập tên phần thưởng" />
            </Form.Item>
            <Form.Item label="Phân loại" name="category" rules={[{ required: true, message: 'Vui lòng chọn phân loại' }]}>
              <Select placeholder="Chọn phân loại">
                <Option value="banner">Cờ hiệu</Option>
                <Option value="title">Danh hiệu</Option>
                <Option value="empty">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Mô tả" name="condition" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
              <Input.TextArea placeholder="Nhập mô tả" rows={3} />
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
          <Button type="primary" htmlType="submit" loading={loading}>
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
