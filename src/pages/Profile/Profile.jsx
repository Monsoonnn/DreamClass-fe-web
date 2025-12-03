import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import ProfileEdit from './ProfileEdit';

export default function Profile() {
  const { user } = useAuth();
  const [editVisible, setEditVisible] = useState(false);

  if (!user) {
    return <div className="p-5 text-center text-lg">Không tìm thấy thông tin người dùng.</div>;
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
          <Avatar size={80} src={user.avatar} icon={<UserOutlined />} />
          <div>
            <div className="text-xl font-bold">{user.name}</div>
            <div className="text-gray-500">@{user.username}</div>
          </div>
        </div>

        {/* Info List */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Họ và tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Lớp">{user.className}</Descriptions.Item>
          <Descriptions.Item label="Khối">{user.grade}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">{user.gender}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{user.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{user.address}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{user.notes}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Modal Edit Profile */}
      <ProfileEdit visible={editVisible} onClose={() => setEditVisible(false)} />
    </div>
  );
}
