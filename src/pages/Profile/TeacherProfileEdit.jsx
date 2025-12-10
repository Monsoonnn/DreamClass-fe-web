import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import dayjs from 'dayjs';

export default function TeacherProfileEdit({ visible, onClose, teacher, onUpdated }) {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (teacher) {
      // Kiểm tra nếu có thông tin lớp và khối
      const assignedClass = teacher.assignedClasses && teacher.assignedClasses[0];

      form.setFieldsValue({
        ...teacher,
        className: assignedClass ? assignedClass.className : '', // Nếu có lớp thì lấy tên lớp
        grade: assignedClass ? assignedClass.grade : '', // Nếu có khối thì lấy giá trị khối
        dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null, // Format ngày sinh
      });
      setAvatarPreview(teacher.avatar);
      setSelectedFile(null);
    }
  }, [teacher, form]);

  // Xử lý thay đổi ảnh đại diện
  const handleBeforeUpload = (file) => {
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setSelectedFile(file);
    return false;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      // 1. Update Profile Info (JSON) - Chỉ lấy các trường API cho phép
      const updateData = {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        address: values.address,
        phone: values.phone,
        // notes, className, grade không được phép update qua API này
      };
      
      // Nếu password rỗng (không đổi), xoá khỏi payload
      if (!updateData.password) {
        delete updateData.password;
      }

      await apiClient.put(`/teacher/profile`, updateData);

      // 2. Update Avatar (FormData) if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        
        await apiClient.put(`/teacher/profile/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      message.success('Cập nhật thông tin thành công!');
      onUpdated(); // Reload lại dữ liệu sau khi cập nhật
      onClose(); // Đóng modal
    } catch (err) {
      console.error('Validation Failed:', err);
      message.error('Cập nhật thông tin thất bại! ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

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
        form={form}
        layout="vertical"
        initialValues={{
          ...teacher,
          dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null, // Format ngày sinh
        }}
      >
        {/* Avatar */}
        <Form.Item label="Ảnh đại diện">
          <Upload 
            beforeUpload={handleBeforeUpload} 
            showUploadList={false}
            accept="image/*"
            maxCount={1}
            disabled={submitting}
          >
            <Button icon={<UploadOutlined />} disabled={submitting}>Chọn ảnh</Button>
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

          <Form.Item name="address" label="Địa chỉ">
            <Input disabled={submitting} />
          </Form.Item>
          
          <Form.Item name="phone" label="Số điện thoại">
             <Input disabled={submitting} />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={1} disabled={true} />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu mới">
            <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn đổi)" disabled={submitting} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
