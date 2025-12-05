import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Spin, message, Tag } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import StudentProfileEdit from './StudentProfileEdit';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/auth/profile');
      setStudent(res.data.data);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải thông tin học sinh!');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex justify-center p-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2 flex justify-center">
      <Card
        title="Thông tin cá nhân"
        className="w-full max-w-2xl shadow-md border border-gray-200 rounded-none"
        headStyle={{ fontSize: 20, fontWeight: 'bold', color: '#23408e' }}
        extra={
          <Button type="primary" icon={<EditOutlined />} onClick={() => setEditVisible(true)} style={{ background: '#23408e' }}>
            Sửa thông tin
          </Button>
        }
      >
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar size={80} src={student.avatar} icon={<UserOutlined />} />
          <div>
            <div className="text-xl font-bold">{student.name}</div>
            <div className="text-gray-500">@{student.username}</div>
          </div>
        </div>

        {/* Info List */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Tên học sinh">{student.name}</Descriptions.Item>
          <Descriptions.Item label="Username">{student.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">{student.gender}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{student.dateOfBirth ? student.dateOfBirth.substring(0, 10) : ''}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{student.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{student.address}</Descriptions.Item>

          {/* Lớp & Khối */}
          <Descriptions.Item label="Lớp">{student.className}</Descriptions.Item>
          <Descriptions.Item label="Khối">{student.grade}</Descriptions.Item>
          {/* <Descriptions.Item label="Ghi chú">{student.notes}</Descriptions.Item> */}
        </Descriptions>
      </Card>

      {/* Modal chỉnh sửa */}
      <StudentProfileEdit visible={editVisible} onClose={() => setEditVisible(false)} student={student} onUpdated={fetchProfile} />
    </div>
  );
}
