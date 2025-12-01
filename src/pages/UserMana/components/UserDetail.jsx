import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Spin, message, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
// import { getUsers } from './userService';
import UserUpdate from './UserUpdate';
import { apiClient } from '../../../services/api';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        console.log('Fetching player by id:', id);
        const res = await apiClient.get(`/players/admin/players/${id}`);
        console.log('Player detail response:', res.data);

        const payload = res.data?.data || null;
        if (!payload) {
          message.error('Không tìm thấy người dùng!');
          setTimeout(() => navigate('/user-mana'), 1200);
          return;
        }

        // Normalize API fields to the UI fields used below
        const normalized = {
          _id: payload._id,
          name: payload.name,
          playerId: payload.playerId,
          email: payload.email,
          role: payload.role,
          gold: payload.gold,
          isVerified: payload.isVerified,
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt,
          avatar: payload.avatar,
          username: payload.username,
          address: payload.address,
          class: payload.className || payload.class,
          level: payload.grade || payload.level,
          dob: payload.dateOfBirth ? new Date(payload.dateOfBirth).toLocaleDateString() : payload.dateOfBirth,
          dateOfBirth: payload.dateOfBirth,
          gender: payload.gender,
          note: payload.notes || payload.note,
          phone: payload.phone,
          points: payload.points,
          status: payload.status,
          raw: payload,
        };

        setUser(normalized);
      } catch (err) {
        console.error('Error fetching player detail:', err.response?.status, err.message);
        if (err.response?.status === 401) {
          message.error('Chưa đăng nhập hoặc hết hạn phiên. Vui lòng đăng nhập lại.');
          setTimeout(() => navigate('/login'), 800);
        } else {
          message.error('Lỗi khi tải thông tin người dùng');
          setTimeout(() => navigate('/user-mana'), 1200);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-50 py-2 px-2">
      <div className="w-full px-0">
        {/* Breadcrumb */}
        <div className="mb-2">
          <Breadcrumb
            style={{ fontSize: 14 }}
            items={[
              {
                href: '/user-mana',
                title: 'Quản lý người dùng',
              },
              {
                title: <span className="font-semibold text-[#23408e]">Chi tiết người dùng</span>,
              },
            ]}
          />
        </div>

        {/* CARD */}
        <Card className="bg-white rounded-lg shadow border-0 w-full max-w-none" style={{ padding: 0, marginTop: 8 }} bodyStyle={{ padding: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-6">
            {/* Avatar + basic info */}
            <div className="md:col-span-1 flex flex-col items-start gap-2">
              <img src={user.avatar || '/avatar-default.png'} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-200 object-cover shadow mb-2" />

              <div className="text-xl font-bold text-[#23408e] leading-tight">{user.name}</div>

              <Tag
                color={user.role === 'teacher' ? 'blue' : 'green'}
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  padding: '2px 12px',
                  marginTop: 4,
                }}
              >
                {user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
              </Tag>
            </div>

            {/* Detail info */}
            <div className="md:col-span-3 w-full">
              <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{
                  width: 120,
                  fontWeight: 500,
                  color: '#23408e',
                  background: '#f4f8ff',
                  fontSize: 15,
                  padding: 6,
                }}
                contentStyle={{
                  background: '#fff',
                  fontSize: 13,
                  padding: 6,
                }}
                className="rounded-lg"
              >
                <Descriptions.Item label="Giới tính">{user.gender}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{user.dob}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{user.address}</Descriptions.Item>
                <Descriptions.Item label="Khối">{user.level || '—'}</Descriptions.Item>
                <Descriptions.Item label="Lớp">{user.class || '—'}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Tài khoản">{user.username}</Descriptions.Item>
                <Descriptions.Item label="Ghi chú">{user.note}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            size="middle"
            className="bg-white border border-gray-200 shadow-sm text-[#23408e] font-semibold hover:bg-blue-50"
          >
            Quay lại
          </Button>

          <Button size="middle" type="primary" className="font-semibold" onClick={() => setOpenUpdate(true)}>
            Chỉnh sửa
          </Button>
        </div>
      </div>
      <UserUpdate
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        userData={user}
        onUpdated={(updatedUser) => {
          setUser({
            ...user,
            ...updatedUser,
          });
        }}
      />
    </div>
  );
}
