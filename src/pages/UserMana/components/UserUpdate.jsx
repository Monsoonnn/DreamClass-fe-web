import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, Avatar, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';

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
      form.setFieldsValue({
        ...userData,
        dob: userData.dateOfBirth?.split('T')[0] || userData.dob,
      });
      setAvatarPreview(userData.avatar);
    }
  }, [open, userData]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        username: values.username,
        email: values.email,

        avatar: avatarPreview || userData.avatar,

        className: values.class || values.className || '',
        grade: values.level || values.grade || '',
        gender: values.gender,
        dateOfBirth: values.dob || values.dateOfBirth,
        address: values.address || '',
        phone: values.phone || '',
        notes: values.note || values.notes || '',
      };

      const identifier = userData.playerId || userData._id;
      const res = await apiClient.put(`/players/admin/players/${identifier}`, payload);

      message.success('Cập nhật thành công!');

      onUpdated(res.data?.data || payload);
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thất bại!');
    }
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

        {/* 2 cột form */}
        <Row gutter={16}>
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
          </Col>
        </Row>

        <Form.Item label="Ghi chú" name="note">
          <Input />
        </Form.Item>

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
