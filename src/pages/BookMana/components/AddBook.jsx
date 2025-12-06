import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Breadcrumb, Spin } from 'antd';
import { UploadOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';

const { Option } = Select;

export default function AddBook() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10; // < 10MB
    if (!isLt10M) message.error('File phải nhỏ hơn 10MB!');
    return isLt10M || Upload.LIST_IGNORE;
  };

  const handleSave = (values) => {
    // Kiểm tra xem đã chọn file không
    if (fileList.length === 0) {
      message.error('Vui lòng tải lên file sách');
      return;
    }

    uploadBook(values);
  };

  const uploadBook = async (values) => {
    setLoading(true);
    try {
      // Tạo FormData để gửi file và dữ liệu
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj);
      formData.append('title', values.name);
      formData.append('grade', values.level);
      formData.append('subject', values.subject || '');
      formData.append('description', values.description);
      formData.append('note', values.note || '');
      formData.append('category', values.category);

      // Gửi request POST
      const response = await apiClient.post('/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Thêm sách thành công!');
      form.resetFields();
      setFileList([]);
      // Quay lại trang quản lý sách sau 1.5s
      setTimeout(() => {
        navigate('/book-mana');
      }, 1500);
    } catch (err) {
      console.error('Upload failed:', err);
      message.error(err.response?.data?.message || 'Thêm sách thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="">
      <div className="p-2">
        <Breadcrumb
          className="mb-2 text-sm"
          items={[
            {
              href: '/book-mana',
              title: (
                <>
                  <UserOutlined />
                  <span>Quản lý sách</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <UnorderedListOutlined />
                  <span className="font-semibold text-[#23408e]">Thêm sách</span>
                </>
              ),
            },
          ]}
        />
      </div>
      <div className="bg-white shadow-lg p-2 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Thêm sách mới</h2>
        <Spin spinning={loading}>
          <Form form={form} className="custom-form" layout="vertical" onFinish={handleSave}>
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

            <Form.Item label="Môn học" name="subject">
              <Input placeholder="Nhập tên môn học (nếu có)" />
            </Form.Item>

            <Form.Item label="Nhà xuất bản" name="category" rules={[{ required: true, message: 'Nhập tên nhà xuất bản' }]}>
              <Input placeholder="Nhập tên nhà xuất bản" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả' }]}>
              <Input.TextArea rows={2} placeholder="Mô tả sách" />
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
              <Button onClick={handleCancel} className="mr-2" disabled={loading}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}
