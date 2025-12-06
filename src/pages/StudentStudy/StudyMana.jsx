import React, { useEffect, useState } from 'react';
import { Tabs, Spin, Breadcrumb, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import StudyHistory from './components/StudyHistory';
import StudyAchievements from './components/StudyAchievements';
import apiClient from '../../services/api';

export default function StudyMana() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy profile học sinh
  const fetchStudentProfile = async () => {
    try {
      const res = await apiClient.get('/players/profile');
      return res.data.data || null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const profile = await fetchStudentProfile();

      if (!profile) {
        message.error('Không thể tải thông tin học sinh!');
        navigate('/'); // hoặc trang dashboard học sinh
        setLoading(false);
        return;
      }

      setStudent(profile);
      setLoading(false);
    };

    getData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2 bg-blue-50 min-h-screen">
      {/* Breadcrumb giống StudentDetail */}
      <Breadcrumb className="py-2 px-2 font-semibold text-[#23408e]" items={[{ href: '/student-home', title: 'Trang học sinh' }, { title: 'Học tập' }]} />

      <div className="bg-white shadow p-2">
        {student && (
          <Tabs
            className="font-medium text-[#23408e]"
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Lịch sử học tập',
                children: <StudyHistory student={student} />,
              },
              {
                key: '2',
                label: 'Thành tích học tập',
                children: <StudyAchievements student={student} />,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
