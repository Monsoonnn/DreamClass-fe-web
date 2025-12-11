import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Spin, Breadcrumb } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TeacherUpdate from './TeacherUpdate';
import { apiClient } from '../../../services/api';
import { formatDate } from '../../../utils/dateUtil';
import { showError } from '../../../utils/swalUtils';

export default function TeacherDetail() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      try {
        console.log('Fetching teacher detail for teacherId:', teacherId);
        const res = await apiClient.get(`/accounts/teachers/${teacherId}`);
        console.log('Teacher detail response:', res.data);

        const payload = res.data?.data;
        if (!payload) {
          showError('Không tìm thấy giáo viên!');
          setTimeout(() => navigate('/user-mana'), 1200);
          return;
        }

        // Chuẩn hóa dữ liệu cho UI
        const normalized = {
          _id: payload._id,
          teacherId: payload.teacherId,
          name: payload.name,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          avatar: payload.avatar,
          gender: payload.gender,
          dateOfBirth: payload.dateOfBirth,
          dob: formatDate(payload.dateOfBirth),
          address: payload.address,
          phone: payload.phone,
          note: payload.notes,
          notes: payload.notes,
          status: payload.status,
          assignedClasses: payload.assignedClasses || [],
          createdAt: payload.createdAt,
          updatedAt: payload.updatedAt,
          raw: payload,
        };

        console.log('Normalized teacher:', normalized);
        setTeacher(normalized);
      } catch (err) {
        console.error('Error fetching teacher detail:', err.response?.data || err.message || err);
        showError('Lỗi khi tải thông tin giáo viên: ' + (err.response?.data?.message || err.message));
        setTimeout(() => navigate('/user-mana'), 1200);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      console.log('useEffect triggered with teacherId:', teacherId);
      fetchTeacher();
    }
  }, [teacherId, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );

  if (!teacher) return null;

  // Avoid passing empty string to img src (React warns). If avatar is empty/whitespace, treat as null.
  const avatarSrc = teacher.avatar && typeof teacher.avatar === 'string' && teacher.avatar.trim() !== '' ? teacher.avatar.trim() : null;

  return (
    <div className="min-h-screen bg-blue-50 py-2 px-2">
      <Breadcrumb
        className="mb-2"
        items={[{ href: '/user-mana', title: 'Quản lý người dùng' }, { title: <span className="font-semibold text-[#23408e]">Chi tiết giáo viên</span> }]}
      />

      <Card className="bg-white rounded-lg shadow border-0 w-full max-w-none" bodyStyle={{ padding: 0 }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-6">
          {/* Avatar + Basic info */}
          <div className="md:col-span-1 flex flex-col items-start gap-2">
            <img src={avatarSrc ?? '/avatar-default.png'} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-200 object-cover shadow mb-2" />
            <div className="text-xl font-bold text-[#23408e] leading-tight">{teacher.name}</div>
            <Tag color="blue" style={{ fontWeight: 600, fontSize: 12, padding: '2px 12px', marginTop: 4 }}>
              Giáo viên
            </Tag>
          </div>

          {/* Detail info */}
          <div className="md:col-span-3 w-full">
            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{ width: 120, fontWeight: 500, color: '#23408e', background: '#f4f8ff', fontSize: 15, padding: 6 }}
              contentStyle={{ background: '#fff', fontSize: 13, padding: 6 }}
              className="rounded-lg"
            >
              <Descriptions.Item label="Giới tính">
                {teacher.gender ? (teacher.gender.toLowerCase() === 'male' ? 'Nam' : teacher.gender.toLowerCase() === 'female' ? 'Nữ' : teacher.gender) : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{teacher.dob}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{teacher.address}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{teacher.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{teacher.email}</Descriptions.Item>
              <Descriptions.Item label="Tài khoản">{teacher.username}</Descriptions.Item>
              <Descriptions.Item label="Lớp được phân công">
                {teacher.assignedClasses.length > 0 ? teacher.assignedClasses.map((c) => `${c.grade} - ${c.className}`).join(', ') : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{teacher.note || teacher.notes}</Descriptions.Item>
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

      <TeacherUpdate open={openUpdate} onClose={() => setOpenUpdate(false)} teacherData={teacher} onUpdated={(updatedTeacher) => setTeacher({ ...teacher, ...updatedTeacher })} />
    </div>
  );
}
