import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { addBook } from './BookService';

const { Option } = Select;

export default function AddBook() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [fileURL, setFileURL] = useState(''); // Lưu URL tạm thời

  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) message.error('File phải nhỏ hơn 5MB!');
    return isLt5M || Upload.LIST_IGNORE;
  };

  const handleSave = (values) => {
    // Tạo URL cho file nếu có
    const url = fileList.length > 0 ? URL.createObjectURL(fileList[0].originFileObj) : '';
    setFileURL(url);

    const newBook = {
      code: values.code,
      name: values.name,
      level: values.level,
      description: values.description,
      note: values.note,
      filePath: url, // lưu URL để click mở
    };

    addBook(newBook);
    message.success('Thêm sách thành công!');
    navigate(-1);
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="bg-white shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Thêm sách mới</h2>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item label="Mã sách" name="code" rules={[{ required: true, message: 'Nhập mã sách' }]}>
          <Input placeholder="Nhập mã sách" />
        </Form.Item>

        <Form.Item label="Tên sách" name="name" rules={[{ required: true, message: 'Nhập tên sách' }]}>
          <Input placeholder="Nhập tên sách" />
        </Form.Item>

        <Form.Item label="Khối học" name="level" rules={[{ required: true, message: 'Chọn khối học' }]}>
          <Select placeholder="Chọn khối học">
            <Option value="10">10</Option>
            <Option value="11">11</Option>
            <Option value="12">12</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} placeholder="Mô tả sách" />
        </Form.Item>

        <Form.Item label="File sách">
          <Upload beforeUpload={beforeUpload} fileList={fileList} onRemove={() => setFileList([])} onChange={({ fileList }) => setFileList(fileList)} maxCount={1}>
            <Button icon={<UploadOutlined />}>Tải lên file</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
        </Form.Item>

        <Form.Item className="flex justify-end mt-4">
          <Button onClick={handleCancel} className="mr-2">
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
