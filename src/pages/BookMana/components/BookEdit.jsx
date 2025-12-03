import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, message, Upload, Space } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';

const { Option } = Select;

export default function BookEdit({ visible, onClose, bookKey, onUpdate }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [fileURL, setFileURL] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookKey && visible) {
      fetchBookDetail();
    }
  }, [bookKey, visible]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/pdfs/${bookKey}`);
      const book = res.data?.data;

      if (book) {
        form.setFieldsValue({
          title: book.title,
          category: book.category,
          grade: book.grade,
          subject: book.subject,
          description: book.description,
          note: book.note,
        });
        setFileURL(book.pdfUrl || '');
        setFileList([]);
      }
    } catch (err) {
      console.error('Lỗi fetch chi tiết sách:', err);
      message.error('Không thể tải thông tin sách');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category', values.category || '');
      formData.append('grade', values.grade);
      formData.append('subject', values.subject || '');
      formData.append('description', values.description || '');
      formData.append('note', values.note || '');

      if (fileList.length > 0) {
        formData.append('file', fileList[0].originFileObj);
      }

      await apiClient.put(`/pdfs/${bookKey}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Cập nhật sách thành công!');
      onUpdate(); // Reload danh sách
      onClose();
    } catch (err) {
      console.error('Lỗi cập nhật sách:', err);
      message.error(err.response?.data?.message || 'Cập nhật sách thất bại!');
    } finally {
      setLoading(false);
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
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          Lưu
        </Button>,
      ]}
      width={700}
    >
      <Form className="custom-form" form={form} layout="vertical">
        {/* GRID 2 CỘT */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="title" label="Tên sách" rules={[{ required: true, message: 'Nhập tên sách' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Nhà xuất bản">
            <Input />
          </Form.Item>
          <Form.Item name="grade" label="Khối học" rules={[{ required: true, message: 'Chọn khối học' }]}>
            <Select>
              <Option value="10">10</Option>
              <Option value="11">11</Option>
              <Option value="12">12</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subject" label="Môn học">
            <Input placeholder="Nhập tên môn học (nếu có)" />
          </Form.Item>
          <div /> {/* Ô trống để căn lệch hàng */}
          {/* FULL WIDTH */}
          <Form.Item name="description" label="Mô tả" className="col-span-2">
            <Input.TextArea rows={2} />
          </Form.Item>
          {/* File sách */}
          <Form.Item label="File sách" className="col-span-2">
            <Space direction="vertical" style={{ width: '100%' }}>
              {fileURL && fileList.length === 0 && (
                <div>
                  <a href={fileURL} target="_blank" rel="noreferrer">
                    📄 Xem file hiện tại
                  </a>
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={handleRemoveFile}>
                    Xóa file
                  </Button>
                </div>
              )}

              <Upload
                beforeUpload={(file) => {
                  // Validate file type
                  const isPDF = file.type === 'application/pdf';
                  if (!isPDF) {
                    message.error('Chỉ được upload file PDF!');
                    return Upload.LIST_IGNORE;
                  }
                  setFileList([file]);
                  return false; // Không tự động upload
                }}
                onRemove={() => setFileList([])}
                fileList={fileList}
                maxCount={1}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>{fileList.length > 0 ? 'Thay đổi file' : 'Chọn file mới'}</Button>
              </Upload>
            </Space>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú" className="col-span-2">
            <Input.TextArea rows={1} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
