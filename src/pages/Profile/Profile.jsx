import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Spin, message } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { apiClient } from '../../services/api';
import ProfileEdit from './ProfileEdit';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const { updateUser, user } = useAuth();

  useEffect(() => {
    // Initial fetch of profile data
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const role = user?.role;
      let endpoint = '/auth/profile'; // Default/Admin

      if (role === 'student') {
        endpoint = '/players/profile';
      } else if (role === 'teacher') {
        endpoint = '/teacher/profile';
      }

      const res = await apiClient.get(endpoint);
      const newData = res.data.data;
      setProfile(newData);
      // Cập nhật luôn vào Global State (AuthContext) để Header nhận diện thay đổi mới nhất
      updateUser(newData);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải thông tin người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    fetchProfile();
  };

  const translateGender = (gender) => {
    if (gender === 'Male') return 'Nam';
    if (gender === 'Female') return 'Nữ';
    return gender;
  };

  if (loading || !profile) {
    return (
      <div className="p-5 flex justify-center">
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
          <Avatar size={80} src={profile.avatar} icon={<UserOutlined />} />
          <div>
            <div className="text-xl font-bold">{profile.name}</div>
            <div className="text-gray-500">@{profile.username}</div>
          </div>
        </div>

        {/* Info List */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Họ và tên">{profile.name}</Descriptions.Item>
          <Descriptions.Item label="Username">{profile.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>

          {/* Nếu là học sinh thì có className, grade */}
          {profile.assignedClasses?.length > 0 && (
            <>
              <Descriptions.Item label="Lớp">{profile.assignedClasses[0].className}</Descriptions.Item>
              <Descriptions.Item label="Khối">{profile.assignedClasses[0].grade}</Descriptions.Item>
            </>
          )}

          <Descriptions.Item label="Giới tính">{translateGender(profile.gender)}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{profile.dateOfBirth ? dayjs(profile.dateOfBirth).format('DD-MM-YYYY') : ''}</Descriptions.Item>
          {/* <Descriptions.Item label="Địa chỉ">{profile.address}</Descriptions.Item> */}
          <Descriptions.Item label="Số điện thoại">{profile.phone}</Descriptions.Item>
          {/* <Descriptions.Item label="Ghi chú">{profile.notes}</Descriptions.Item> */}
        </Descriptions>
      </Card>

      {/* Modal Edit Profile */}
      <ProfileEdit visible={editVisible} onClose={() => setEditVisible(false)} user={profile} onUpdated={handleProfileUpdate} />
    </div>
  );
}
