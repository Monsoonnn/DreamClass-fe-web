import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';

const { Option } = Select;

export default function TeacherForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // ===== PAYLOAD CHUẨN THEO API =====
      const payload = {
        name: values.name,
        username: values.username,
        password: values.password, // bắt buộc
        email: values.email || '',
        gender: values.gender, // Male / Female
        dateOfBirth: values.dateOfBirth, // YYYY-MM-DD
        address: values.address || '',
        phone: values.phone || '',
        notes: values.notes || '',
        assignedClasses: [
          {
            grade: values.grade,
            className: values.className,
          },
        ],
      };

      console.log('Payload gửi lên backend:', payload);

      await apiClient.post('/accounts/teachers/create', payload);

      message.success('Thêm giáo viên thành công!');
      form.resetFields();

      setTimeout(() => navigate('/user-mana'), 800);
    } catch (err) {
      console.error('Error creating teacher:', err.response?.data || err.message);
      message.error(err.response?.data?.message || 'Không thể thêm giáo viên.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
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
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          {/* KHỐI */}
          <Form.Item label="Khối phụ trách" name="grade" rules={[{ required: true, message: 'Nhập khối' }]}>
            <Input placeholder="VD: 9" />
          </Form.Item>

          {/* LỚP */}
          <Form.Item label="Lớp phụ trách" name="className" rules={[{ required: true, message: 'Nhập lớp' }]}>
            <Input placeholder="VD: 9A" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      {/* Account */}
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

      {/* Action buttons */}
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
