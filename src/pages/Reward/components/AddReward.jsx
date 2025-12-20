import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, InputNumber, Row, Col, Breadcrumb } from 'antd';
import { UploadOutlined, PlusOutlined, GiftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

const { Option } = Select;

export default function AddReward() {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const maxSizeMB = 1;

  const handleUploadChange = ({ file, fileList }) => {
    const currentFile = file.originFileObj || file;
    if (!currentFile) return;

    if (currentFile.size / 1024 / 1024 > maxSizeMB) {
      showError(`Dung lượng tối đa là ${maxSizeMB}MB`);
      return;
    }
    setFileList(fileList);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(currentFile);
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      showError('Vui lòng tải lên ảnh phần thưởng');
      return;
    }

    const file = fileList[0].originFileObj;

    const formData = new FormData();
    formData.append('itemId', values.rewardCode);
    formData.append('name', values.rewardName);
    formData.append('type', values.category); // Lưu ý: Backend có thể cần 'empty', 'badge'... thay vì tiếng Việt
    formData.append('condition', values.condition);
    formData.append('notes', values.note || '');
    formData.append('image', file);

    formData.append('description', values.condition || 'Mô tả phần thưởng');

    showLoading();
    try {
      await apiClient.post('/items/admin', formData, {
        headers: {
          'Content-Type': undefined,
        },
      });

      closeLoading();
      await showSuccess('Thêm phần thưởng thành công!');

      form.resetFields();
      setPreviewImage(null);
      setFileList([]);
      navigate('/item-mana');
    } catch (error) {
      console.error('Add Reward Error:', error);
      closeLoading();
      const errorMsg = error.response?.data?.message || 'Lỗi hệ thống (500)';
      showError(errorMsg);
    }
  };

  return (
    <div className="p-2">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/item-mana',
            title: (
              <>
                <GiftOutlined />
                <span className="font-semibold text-[#23408e]">Quản lý phần thưởng</span>
              </>
            ),
          },
          {
            title: (
              <>
                <PlusOutlined />
                <span>Thêm phần thưởng</span>
              </>
            ),
          },
        ]}
      />
      <div className="bg-white shadow-lg p-5 rounded-md max-w-4xl mx-auto ">
        <h2 className="text-lg font-semibold mb-4">Thêm phần thưởng</h2>
        <Form className="custom-form" form={form} layout="vertical" onFinish={onFinish} initialValues={{ quantity: 1 }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Mã phần thưởng" name="rewardCode" rules={[{ required: true, message: 'Nhập mã' }]}>
                <Input placeholder="VD: GG001118" />
              </Form.Item>
              <Form.Item label="Tên phần thưởng" name="rewardName" rules={[{ required: true, message: 'Nhập tên' }]}>
                <Input placeholder="VD: Chúc bạn may mắn" />
              </Form.Item>
              <Form.Item label="Phân loại" name="category" rules={[{ required: true, message: 'Chọn phân loại' }]}>
                <Select placeholder="Chọn phân loại">
                  {/* Đảm bảo value khớp với backend quy định */}

                  <Option value="banner">Cờ hiệu</Option>
                  <Option value="title">Danh hiệu</Option>
                  <Option value="empty">Khác (Empty)</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Số lượng" name="quantity">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Mô tả" name="condition" rules={[{ required: true, message: 'Nhập mô tả' }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ảnh phần thưởng (Bắt buộc)">
                <Upload listType="picture" beforeUpload={() => false} fileList={fileList} onChange={handleUploadChange} maxCount={1} accept="image/*">
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
                {previewImage && <img src={previewImage} alt="preview" className="mt-2 w-full h-48 object-cover rounded" />}
              </Form.Item>
              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex gap-2 mt-4">
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button danger onClick={() => navigate('/item-mana')}>
              Hủy
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
