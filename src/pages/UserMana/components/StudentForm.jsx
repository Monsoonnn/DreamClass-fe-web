import React, { useState } from 'react';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

const { Option } = Select;

export default function StudentForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      showLoading();
      setLoading(true);

      const newUser = {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        className: values.className || '',
        grade: values.grade || '',
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        address: values.address || '',
        phone: values.phone || '',
        notes: values.notes || '',
      };

      const response = await apiClient.post('/accounts/students/create', newUser);

      console.log('API Response:', response.data);
      closeLoading();
      await showSuccess('Thêm học sinh thành công!');
      
      form.resetFields();
      navigate('/user-mana');
    } catch (err) {
      console.error('Lỗi khi thêm học sinh:', err);
      closeLoading();
      showError('Không thể thêm học sinh. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" className="bg-white p-4 custom-form rounded-lg shadow-md max-w-4xl mx-auto">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Nhập họ và tên' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Chọn giới tính' }]}>
            <Select placeholder="Chọn giới tính">
              <Option value="Male">Nam</Option>
              <Option value="Female">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Lớp học" name="className">
            <Input />
          </Form.Item>

          <Form.Item label="Khối" name="grade">
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <div className="text-lg font-semibold mt-4 mb-2">Tài khoản</div>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Nhập username' }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          danger
          onClick={() => {
            form.resetFields();
            navigate('/user-mana');
          }}
        >
          Hủy
        </Button>
        <Button type="primary" loading={loading} onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </Form>
  );
}
