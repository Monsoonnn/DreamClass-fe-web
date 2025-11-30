import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, message, Upload, Space } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { updateBook, getBookByKey } from './BookService';

const { Option } = Select;

export default function BookEdit({ visible, onClose, bookKey, onUpdate }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [fileURL, setFileURL] = useState('');

  useEffect(() => {
    if (bookKey) {
      const book = getBookByKey(bookKey);
      if (book) {
        form.setFieldsValue(book);
        setFileList([]);
        setFileURL(book.filePath || '');
      }
    }
  }, [bookKey, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Nếu có file mới, đọc sang Base64 trước khi lưu
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const updatedBook = { ...values, filePath: reader.result };
          updateBook(bookKey, updatedBook);
          message.success('Cập nhật sách thành công!');
          onUpdate();
          onClose();
        };
      } else {
        const updatedBook = { ...values, filePath: fileURL }; // giữ file cũ
        updateBook(bookKey, updatedBook);
        message.success('Cập nhật sách thành công!');
        onUpdate();
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setFileURL('');
  };

  return (
    <Modal
      title="Chỉnh sửa sách"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên sách" rules={[{ required: true, message: 'Nhập tên sách' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Nhà xuất bản">
          <Input />
        </Form.Item>
        <Form.Item name="level" label="Khối học">
          <Select>
            <Option value="10">10</Option>
            <Option value="11">11</Option>
            <Option value="12">12</Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={2} />
        </Form.Item>

        {/* File sách */}
        <Form.Item label="File sách">
          <Space direction="vertical" style={{ width: '100%' }}>
            {fileURL && (
              <div>
                <a href={fileURL} target="_blank" rel="noreferrer">
                  Mở file
                </a>
                <Button type="link" icon={<DeleteOutlined />} onClick={handleRemoveFile}>
                  Xóa file
                </Button>
              </div>
            )}
            <Upload
              beforeUpload={(file) => {
                setFileList([file]);
                return false; // không upload tự động
              }}
              onRemove={() => setFileList([])}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file mới</Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
