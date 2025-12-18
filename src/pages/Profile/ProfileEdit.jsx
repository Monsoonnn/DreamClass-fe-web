import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import dayjs from 'dayjs';

export default function ProfileEdit({ visible, onClose, user, onUpdated }) {
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      // Điền thông tin vào form khi modal mở
      form.setFieldsValue({
        ...user, // Các trường cơ bản
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null, // Format lại ngày sinh
      });
      setAvatarPreview(user.avatar); // Đặt ảnh đại diện mặc định
      setSelectedFile(null); // Reset file đã chọn
    }
  }, [user, form]);

  const handleBeforeUpload = (file) => {
    // Tạo preview
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    // Lưu file vào state để gửi đi sau
    setSelectedFile(file);
    // Return false để chặn auto upload của Antd
    return false;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const role = user?.role;

      // Determine base endpoint based on role
      let baseEndpoint = '/auth/profile'; // Default
      if (role === 'admin') {
        baseEndpoint = '/accounts/profile';
      } else if (role === 'teacher') {
        baseEndpoint = '/teacher/profile';
      } else if (role === 'student') {
        baseEndpoint = '/players/profile';
      }

      // 1. Update Profile Info (JSON)
      const updateData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      };

      // Update profile info
      await apiClient.put(baseEndpoint, updateData);

      // 2. Update Avatar (FormData) if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        // Update avatar with PUT method
        await apiClient.put(`${baseEndpoint}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      message.success('Cập nhật thông tin thành công!');
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Validation Failed:', err);
      message.error('Cập nhật thông tin thất bại! ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const isStudent = user?.role === 'student';

  return (
    <Modal
      title="Chỉnh sửa thông tin cá nhân"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={submitting}
      className="profile-edit-modal"
      width={600}
    >
      <Form
        className="custom-form"
        form={form}
        layout="vertical"
        initialValues={{
          ...user,
          dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
        }}
      >
        {/* Avatar */}
        <Form.Item label="Ảnh đại diện">
          <Upload beforeUpload={handleBeforeUpload} showUploadList={false} accept="image/*" maxCount={1} disabled={submitting}>
            <Button icon={<UploadOutlined />} disabled={submitting}>
              Chọn ảnh
            </Button>
          </Upload>

          {avatarPreview && <img src={avatarPreview} alt="avatar" className="mt-3 w-24 h-24 rounded-full object-cover" />}
        </Form.Item>

        {/* 2 CỘT */}
        <div className="grid grid-cols-2 gap-1">
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="username" label="Tài khoản" rules={[{ required: true }]}>
            <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input disabled={submitting} />
          </Form.Item>

          {/* Chỉ hiển thị Lớp và Khối nếu là Student */}
          {isStudent && (
            <>
              <Form.Item name="className" label="Lớp">
                <Input disabled={submitting} />
              </Form.Item>

              <Form.Item name="grade" label="Khối">
                <Input disabled={submitting} />
              </Form.Item>
            </>
          )}

          <Form.Item name="gender" label="Giới tính">
            <Select
              options={[
                { value: 'Male', label: 'Nam' },
                { value: 'Female', label: 'Nữ' },
                { value: 'Other', label: 'Khác' },
              ]}
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker format="DD/MM/YYYY" className="w-full" disabled={submitting} />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={1} disabled={submitting} />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu mới">
            <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn đổi)" disabled={submitting} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
