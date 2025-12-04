import React, { useEffect, useState } from 'react';
import { Tabs, Spin, Breadcrumb, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import StudentInfo from './StudentInfo';
import StudentLearning from './StudentLearning';
import StudentAchievements from './StudentAchievements';
import apiClient from '../../../services/api';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStudentById = async (playerID) => {
    try {
      const response = await apiClient.get(`/teacher/students/${playerID}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching student detail:', error);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      const found = await getStudentById(id);

      if (!found) {
        message.error('Không tìm thấy thông tin học sinh!');
        navigate('/student-mana');
        setLoading(false);
        return;
      }

      setStudent(found);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // ================================
  // ⏳ UI loading
  // ================================
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );

  // ================================
  // 🟩 Giao diện
  // ================================
  return (
    <div className="p-2 bg-blue-50 min-h-screen">
      <Breadcrumb className="py-2 px-2 font-semibold text-[#23408e]" items={[{ href: '/student-mana', title: 'Danh sách học sinh' }, { title: 'Chi tiết học sinh' }]} />

      <div className="bg-white shadow p-2">
        {student && (
          <Tabs
            className="font-medium text-[#23408e]"
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Thông tin học sinh',
                children: <StudentInfo student={student} />,
              },
              {
                key: '2',
                label: 'Học tập',
                children: <StudentLearning student={student} playerId={student._id} />,
              },
              {
                key: '3',
                label: 'Thành tích',
                children: <StudentAchievements student={student} />,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
