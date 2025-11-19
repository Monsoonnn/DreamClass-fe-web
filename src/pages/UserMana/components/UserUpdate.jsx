import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { updateUser } from './userService';

const { Option } = Select;

export default function UserUpdate({ open, onClose, userData, onUpdated }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && userData) {
      form.setFieldsValue(userData);
    }
  }, [open, userData]);

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        updateUser(userData.key, values);
        onUpdated(); // refresh data ở trang detail
        onClose();
      })
      .catch(() => {});
  };

  return (
    <Modal title="Cập nhật thông tin người dùng" open={open} onCancel={onClose} footer={null} centered>
      <Form layout="vertical" form={form}>
        <Form.Item label="Họ tên" name="name" rules={[{ required: true, message: 'Nhập họ tên' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
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

        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Tên đăng nhập" name="username">
          <Input />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-3">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
