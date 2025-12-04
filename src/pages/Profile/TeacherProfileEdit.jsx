import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import dayjs from 'dayjs';

export default function TeacherProfileEdit({ visible, onClose, teacher, onUpdated }) {
  const [avatarPreview, setAvatarPreview] = useState(null);
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
    }
  }, [teacher, form]);

  // Xử lý thay đổi ảnh đại diện
  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    form.setFieldValue('avatarFile', file);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let avatarUrl = teacher.avatar;

      if (values.avatarFile) {
        avatarUrl = avatarPreview;
      }

      const updatedTeacher = {
        ...teacher,
        ...values,
        avatar: avatarUrl,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
      };

      // Gửi API cập nhật thông tin
      await apiClient.put(`/api/auth/profile`, updatedTeacher);

      message.success('Cập nhật thông tin thành công!');
      onUpdated(); // Reload lại dữ liệu sau khi cập nhật
      onClose(); // Đóng modal
    } catch (err) {
      console.error('Validation Failed:', err);
      message.error('Cập nhật thông tin thất bại!');
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
          <Upload beforeUpload={() => false} onChange={handleAvatarChange} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>

          {avatarPreview && <img src={avatarPreview} alt="avatar" className="mt-3 w-24 h-24 rounded-full object-cover" />}
        </Form.Item>

        {/* 2 CỘT */}
        <div className="grid grid-cols-2 gap-1">
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

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu mới">
            <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn đổi)" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
