import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Spin, message } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import TeacherProfileEdit from './TeacherProfileEdit';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/teacher/profile');
      const newData = res.data.data;
      setTeacher(newData);
      updateUser(newData);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải thông tin giáo viên!');
    } finally {
      setLoading(false);
    }
  };

  const translateGender = (gender) => {
    if (gender === 'Male') return 'Nam';
    if (gender === 'Female') return 'Nữ';
    return gender;
  };

  if (loading || !teacher) {
    return (
      <div className="flex justify-center p-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2 flex justify-center">
      <Card
        title="Thông tin giáo viên"
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
          <Avatar size={80} src={teacher.avatar} icon={<UserOutlined />} />
          <div>
            <div className="text-xl font-bold">{teacher.name}</div>
            <div className="text-gray-500">@{teacher.username}</div>
          </div>
        </div>

        {/* Info List */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Họ và tên">{teacher.name}</Descriptions.Item>
          <Descriptions.Item label="Username">{teacher.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{teacher.email}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">{translateGender(teacher.gender)}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{teacher.dateOfBirth ? dayjs(teacher.dateOfBirth).format('DD-MM-YYYY') : ''}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{teacher.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{teacher.address}</Descriptions.Item>

          {/* Tách riêng lớp và khối */}
          {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
            <>
              <Descriptions.Item label="Lớp">{teacher.assignedClasses.map((c) => c.className).join(', ')}</Descriptions.Item>
              <Descriptions.Item label="Khối">{teacher.assignedClasses.map((c) => c.grade).join(', ')}</Descriptions.Item>
            </>
          )}

          {teacher.notes && <Descriptions.Item label="Ghi chú">{teacher.notes}</Descriptions.Item>}
        </Descriptions>
      </Card>

      <TeacherProfileEdit visible={editVisible} onClose={() => setEditVisible(false)} teacher={teacher} onUpdated={fetchProfile} />
    </div>
  );
}
