import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, InputNumber, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { addReward } from './RewardService';

const { Option } = Select;

export default function AddReward() {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const maxSizeMB = 1;

  const handleUploadChange = ({ file, fileList }) => {
    // Lấy file gốc, fallback nếu originFileObj undefined
    const currentFile = file.originFileObj || file;

    if (!currentFile) return;

    if (currentFile.size / 1024 / 1024 > maxSizeMB) {
      message.error(`Dung lượng tối đa là ${maxSizeMB}MB`);
      return;
    }

    setFileList(fileList);

    // Chuyển file thành base64 để preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(currentFile);
  };

  const onFinish = (values) => {
    if (!previewImage) {
      message.error('Vui lòng tải lên ảnh phần thưởng');
      return;
    }

    addReward({
      rewardCode: values.rewardCode,
      rewardName: values.rewardName,
      category: values.category,
      quantity: values.quantity,
      condition: values.condition,
      note: values.note,
      image: previewImage,
    });

    message.success('Thêm phần thưởng thành công!');
    form.resetFields();
    setPreviewImage(null);
    setFileList([]);

    navigate('/reward-mana');
  };

  return (
    <div className="bg-white shadow-lg p-5 rounded-md max-w-4xl mx-auto mt-5">
      <h2 className="text-lg font-semibold mb-4">Thêm phần thưởng</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ quantity: 1 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Mã phần thưởng" name="rewardCode" rules={[{ required: true, message: 'Vui lòng nhập mã phần thưởng' }]}>
              <Input placeholder="Nhập mã phần thưởng" />
            </Form.Item>
            <Form.Item label="Tên phần thưởng" name="rewardName" rules={[{ required: true, message: 'Vui lòng nhập tên phần thưởng' }]}>
              <Input placeholder="Nhập tên phần thưởng" />
            </Form.Item>
            <Form.Item label="Phân loại" name="category" rules={[{ required: true, message: 'Vui lòng chọn phân loại' }]}>
              <Select placeholder="Chọn phân loại">
                <Option value="Huy hiệu">Huy hiệu</Option>
                <Option value="Tiền tệ">Tiền tệ</Option>
                <Option value="Danh hiệu">Danh hiệu</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Điều kiện nhận" name="condition" rules={[{ required: true, message: 'Vui lòng nhập điều kiện nhận' }]}>
              <Input.TextArea placeholder="Nhập điều kiện nhận" rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tải hình ảnh phần thưởng" required>
              <Upload
                listType="picture"
                beforeUpload={() => false} // chặn auto upload
                fileList={fileList}
                onChange={handleUploadChange}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên (tối đa {maxSizeMB}MB)</Button>
              </Upload>
              {previewImage && <img src={previewImage} alt="preview" style={{ marginTop: 10, width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />}
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Nhập ghi chú (nếu có)" rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="flex gap-2 mt-4">
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
            Lưu
          </Button>
          <Button type="default" danger onClick={() => navigate('/reward-mana')}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
