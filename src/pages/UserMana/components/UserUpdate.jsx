import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, Avatar, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateUser } from './userService';

const { Option } = Select;

export default function UserUpdate({ open, onClose, userData, onUpdated }) {
  const [form] = Form.useForm();
  const [avatarPreview, setAvatarPreview] = useState('');

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (open && userData) {
      form.setFieldsValue(userData);
      setAvatarPreview(userData.avatar);
    }
  }, [open, userData]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updated = { ...values, avatar: avatarPreview };

      updateUser(userData.key, updated);
      onUpdated();
      onClose();
    } catch (error) {}
  };

  return (
    <Modal title="Cập nhật thông tin người dùng" open={open} onCancel={onClose} footer={null} centered width={800}>
      <Form layout="vertical" form={form}>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <Avatar src={avatarPreview || '/avatar-default.png'} size={110} className="border shadow-md mb-3" />
          <Upload
            showUploadList={false}
            beforeUpload={async (file) => {
              const base64 = await convertToBase64(file);
              setAvatarPreview(base64);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </div>

        {/* 2 Cột Form */}
        <Row gutter={16}>
          {/* Cột trái */}
          <Col span={12}>
            <Form.Item label="Họ tên" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
              <Select>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>

            <Form.Item label="Khối" name="level">
              <Input />
            </Form.Item>
          </Col>

          {/* Cột phải */}
          <Col span={12}>
            <Form.Item label="Mã số" name="code">
              <Input />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input type="email" />
            </Form.Item>

            <Form.Item label="Tên đăng nhập" name="username">
              <Input />
            </Form.Item>

            <Form.Item label="Lớp" name="class">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Ghi chú */}
        <Form.Item label="Ghi chú" name="note">
          <Input />
        </Form.Item>

        {/* Quyền/Role */}
        <Form.Item label="Loại người dùng" name="role" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
