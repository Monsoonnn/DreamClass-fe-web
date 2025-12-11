import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import dayjs from 'dayjs';
import { showLoading, closeLoading, showSuccess, showError } from '../../utils/swalUtils';

export default function StudentProfileEdit({ visible, onClose, student, onUpdated }) {
  const [avatarPreview, setAvatarPreview] = useState(student?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        ...student,
        dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
      });
      setAvatarPreview(student.avatar);
      setSelectedFile(null);
    }
  }, [student, form]);

  const handleBeforeUpload = (file) => {
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setSelectedFile(file);
    return false;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      showLoading();
      const values = await form.validateFields();

      // 1. Update Profile Info (JSON)
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : student.dateOfBirth,
      };

      await apiClient.put(`/players/profile`, payload);

      // 2. Update Avatar (FormData) if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        
        await apiClient.put(`/players/profile/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      closeLoading();
      await showSuccess('Cập nhật thông tin thành công!');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      closeLoading();
      showError('Cập nhật thông tin thất bại! ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Chỉnh sửa thông tin cá nhân" open={visible} onCancel={onClose} onOk={handleSubmit} okText="Lưu thay đổi" cancelText="Hủy" confirmLoading={submitting} width={600}>
      <Form className="custom-form " form={form} layout="vertical">
        {/* Avatar */}
        <Form.Item label="">
          <Upload 
            beforeUpload={handleBeforeUpload} 
            showUploadList={false}
            accept="image/*"
            maxCount={1}
            disabled={submitting}
          >
            <Button icon={<UploadOutlined />} disabled={submitting}>Chọn ảnh đại diện</Button>
          </Upload>

          {avatarPreview && <img src={avatarPreview} alt="avatar" className="mt-1 w-24 h-24 rounded-full object-cover" />}
        </Form.Item>

        {/* Form 2 cột */}
        <div className="grid grid-cols-2 gap-2">
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="username" label="Tài khoản" rules={[{ required: true }]}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="className" label="Lớp">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="grade" label="Khối">
            <Input disabled={true} />
          </Form.Item>

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

          <Form.Item name="phone" label="Số điện thoại">
            <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input disabled={submitting} />
          </Form.Item>

          {/* <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={1} />
          </Form.Item> */}

          <Form.Item name="password" label="Mật khẩu mới">
            <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn đổi)" disabled={submitting} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
