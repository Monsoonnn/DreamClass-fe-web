// UserInfo.jsx
import React from 'react';
import { Descriptions, Tag, Card } from 'antd';
import { formatDate } from '../../../utils/dateUtil';

export default function UserInfo({ user }) {
  // Helper dịch giới tính
  const translateGender = (gender) => {
    if (!gender) return '—';
    const g = gender.toLowerCase();
    if (g === 'male' || g === 'nam') return 'Nam';
    if (g === 'female' || g === 'nữ') return 'Nữ';
    return gender;
  };

  return (
    <Card className="bg-white shadow border-0 w-full max-w-none" styles={{ body: { padding: 0 } }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2">
        <div className="md:col-span-1 flex flex-col items-start gap-2">
          <img src={user.avatar || '/avatar-default.png'} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-200 object-cover shadow mb-2" />

          <div className="text-xl font-bold text-[#23408e] leading-tight">{user.name}</div>
          {/* <div className="text-sm text-gray-500">Mã HS: {user.playerId}</div> */}

          <Tag color={user.role === 'teacher' ? 'blue' : 'green'} style={{ fontWeight: 600, fontSize: 12, padding: '2px 12px', marginTop: 4 }}>
            {user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
          </Tag>
        </div>

        <div className="md:col-span-3 w-full">
          <Descriptions
            column={1}
            bordered
            size="small"
            className="rounded-lg"
            styles={{
              label: { width: 140, fontWeight: 500, color: '#23408e', background: '#f4f8ff', fontSize: 15 },
              content: { background: '#fff', fontSize: 13 },
            }}
          >
            <Descriptions.Item label="Giới tính">{translateGender(user.gender)}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{formatDate(user.dateOfBirth)}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{user.address || '—'}</Descriptions.Item>
            <Descriptions.Item label="Khối">{user.grade || '—'}</Descriptions.Item>
            <Descriptions.Item label="Lớp">{user.className || '—'}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Tài khoản">{user.username}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{user.notes || 'Không có ghi chú'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tham gia">{formatDate(user.createdAt)}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  );
}
