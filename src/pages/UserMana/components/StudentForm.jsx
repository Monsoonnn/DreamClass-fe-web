import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Row, Col } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { addUser } from './userService';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

export default function StudentForm() {
  const [form] = Form.useForm();
  const [avatarBase64, setAvatarBase64] = useState('');
  const [uploadFileList, setUploadFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleBeforeUpload = async (file) => {
    try {
      const b64 = await fileToBase64(file);
      setAvatarBase64(b64);
      setUploadFileList([{ uid: '-1', name: file.name, status: 'done', url: b64 }]);
    } catch (err) {
      message.error('Không thể đọc file ảnh');
    }
    return false;
  };

  const handleRemoveAvatar = () => {
    setAvatarBase64('');
    setUploadFileList([]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const newUser = {
        key: Date.now(),
        code: values.code,
        name: values.name,
        dob: values.dob,
        gender: values.gender,
        address: values.address || '',
        level: values.level || '',
        class: values.class || '',
        phone: values.phone || '',
        email: values.email || '',
        note: values.note || '',
        username: values.username,
        password: values.password,
        role: 'student',
        avatar: avatarBase64 || '',
      };
      await addUser(newUser);

      message.success('Thêm học sinh thành công!');
      form.resetFields();
      setAvatarBase64('');
      setUploadFileList([]);
      navigate('/user-mana');
    } catch (err) {
      console.error(err);
      message.error('Không thể thêm học sinh. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto"
      initialValues={{
        studyStatus: 'Đang học',
      }}
    >
      <Row gutter={16} className="mb-4">
        <Col xs={24} md={16}>
          <div className="text-lg font-semibold mb-2">Thông tin học sinh</div>
        </Col>
        <Col xs={24} md={8} className="flex items-center justify-end">
          <div>
            <Upload accept="image/*" beforeUpload={handleBeforeUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Ảnh đại diện</Button>
            </Upload>

            {uploadFileList.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <img src={uploadFileList[0].url} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
                <Button icon={<DeleteOutlined />} onClick={handleRemoveAvatar} size="small" danger>
                  Xóa
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* 2-column grid */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Nhập họ và tên' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Chọn giới tính' }]}>
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
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
          <Form.Item label="Mã số " name="code">
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Khối" name="level">
            <Input />
          </Form.Item>

          <Form.Item label="Lớp học" name="class">
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <div className="text-lg font-semibold mt-4 mb-2">Tài khoản</div>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Nhập username' }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Phân quyền">
            <Input value="Học sinh" disabled />
          </Form.Item>
        </Col>
      </Row>

      {/* action buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          danger
          onClick={() => {
            form.resetFields();
            setAvatarBase64('');
            setUploadFileList([]);
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
