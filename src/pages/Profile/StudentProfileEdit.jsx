import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import dayjs from 'dayjs';

export default function StudentProfileEdit({ visible, onClose, student, onUpdated }) {
  const [avatarPreview, setAvatarPreview] = useState(student?.avatar || null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        ...student,
        dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
      });
      setAvatarPreview(student.avatar);
    }
  }, [student, form]);

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    form.setFieldValue('avatarFile', file);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let avatarUrl = student.avatar;

      // Nếu có file ảnh mới
      if (values.avatarFile) {
        avatarUrl = avatarPreview;
      }

      const payload = {
        ...student,
        ...values,
        avatar: avatarUrl,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : student.dateOfBirth,
      };

      await apiClient.put(`/auth/profile`, payload);

      message.success('Cập nhật thông tin thành công!');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thông tin thất bại!');
    }
  };

  return (
    <Modal title="Chỉnh sửa thông tin cá nhân" open={visible} onCancel={onClose} onOk={handleSubmit} okText="Lưu thay đổi" cancelText="Hủy" width={600}>
      <Form className="custom-form " form={form} layout="vertical">
        {/* Avatar */}
        <Form.Item label="">
          <Upload beforeUpload={() => false} onChange={handleAvatarChange} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
          </Upload>

          {avatarPreview && <img src={avatarPreview} alt="avatar" className="mt-1 w-24 h-24 rounded-full object-cover" />}
        </Form.Item>

        {/* Form 2 cột */}
        <div className="grid grid-cols-2 gap-2">
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="className" label="Lớp">
            <Input />
          </Form.Item>

          <Form.Item name="grade" label="Khối">
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select
              options={[
                { value: 'Male', label: 'Nam' },
                { value: 'Female', label: 'Nữ' },
                { value: 'Other', label: 'Khác' },
              ]}
            />
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          {/* <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={1} />
          </Form.Item> */}

          <Form.Item name="password" label="Mật khẩu mới">
            <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn đổi)" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
