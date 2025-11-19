import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addUser } from './userService';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

export default function StudentForm() {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const userToSave = {
        ...values,
        avatar: avatarFile ? URL.createObjectURL(avatarFile) : '',
        role: 'student',
      };
      await addUser(userToSave);
      message.success('Thêm học sinh thành công!');
      form.resetFields();
      setAvatarFile(null);
      navigate('/user-mana');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Không thể thêm học sinh. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="horizontal" className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Họ và tên" name="name" rules={[{ message: 'Nhập họ và tên' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="dob" rules={[{ message: 'Chọn ngày sinh' }]}>
          <Input type="date" />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender" rules={[{ message: 'Chọn giới tính' }]}>
          <Select placeholder="Chọn giới tính">
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Dân tộc" name="nation">
          <Input />
        </Form.Item>

        <Form.Item label="CCCD" name="cccd">
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        {/* Thông tin học tập */}
        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Lớp học" name="class">
          <Input />
        </Form.Item>

        <Form.Item label="Trạng thái học" name="studyStatus">
          <Select placeholder="Chọn trạng thái">
            <Option value="Đang học">Đang học</Option>
            <Option value="Nghỉ học">Nghỉ học</Option>
          </Select>
        </Form.Item>

        {/* Avatar */}
        <Form.Item label="Avatar">
          <Upload
            beforeUpload={(file) => {
              setAvatarFile(file);
              return false; // không tự upload
            }}
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input />
        </Form.Item>
      </div>

      {/* Tài khoản */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Nhập username' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item label="Phân quyền">
          <Input value="Học sinh" disabled />
        </Form.Item>
      </div>

      {/* Nút Lưu/Hủy */}
      <div className="flex justify-end gap-3 mt-6">
        <Button type="primary" loading={loading} onClick={handleSave}>
          Lưu
        </Button>
        <Button
          danger
          onClick={() => {
            form.resetFields();
            setAvatarFile(null);
            navigate('/user-mana');
          }}
        >
          Hủy
        </Button>
      </div>
    </Form>
  );
}
