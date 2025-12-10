import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, Avatar, Row, Col, message, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

export default function UserUpdate({ open, onClose, userData, onUpdated }) {
  const [form] = Form.useForm();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userData) {
      form.setFieldsValue({
        ...userData,
        dob: userData.dateOfBirth ? dayjs(userData.dateOfBirth) : null,
        password: '', // Reset password field
      });
      setAvatarPreview(userData.avatar);
      setSelectedFile(null);
    }
  }, [open, userData]);

  const handleBeforeUpload = (file) => {
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setSelectedFile(file);
    return false; // Prevent auto upload
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        username: values.username,
        email: values.email,
        // avatar: avatarPreview || userData.avatar, // Don't send avatar in JSON if we upload file separately
        className: values.class || values.className || '',
        grade: values.level || values.grade || '',
        gender: values.gender,
        dateOfBirth: values.dob ? values.dob.format('YYYY-MM-DD') : values.dateOfBirth,
        address: values.address || '',
        phone: values.phone || '',
        notes: values.note || values.notes || '',
      };

      if (values.password) {
        payload.password = values.password;
      }

      const identifier = userData.playerId || userData._id;
      // 1. Update Info
      const res = await apiClient.put(`/accounts/students/${identifier}`, payload);

      // 2. Update Avatar if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        await apiClient.put(`/accounts/students/${identifier}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      message.success('Cập nhật thành công!');

      onUpdated(res.data?.data || payload);
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Cập nhật thông tin người dùng" open={open} onCancel={onClose} footer={null} centered width={800} confirmLoading={loading}>
      <Form className="custom-form" layout="vertical" form={form}>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <Avatar src={avatarPreview || '/avatar-default.png'} size={110} className="border shadow-md mb-3" />
          <Upload showUploadList={false} beforeUpload={handleBeforeUpload} accept="image/*">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </div>

        {/* 2 cột form */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Họ tên" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true }]}>
              <DatePicker format="DD/MM/YYYY" className="w-full" />
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

          <Col span={12}>
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
            <Form.Item label="Mật khẩu mới" name="password">
              <Input.Password placeholder="Để trống nếu không đổi" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Ghi chú" name="note">
          <Input />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={handleUpdate} loading={loading}>
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
