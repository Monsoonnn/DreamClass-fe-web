import React, { useEffect, useState } from 'react';
import { Tabs, Spin, Breadcrumb } from 'antd';
import { InfoCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import StudentInfo from './StudentInfo';
import StudentLearning from './StudentLearning';
import StudentAchievements from './StudentAchievements';
import StudentHistory from './StudentHistory';
import apiClient from '../../../services/api';
import { showError } from '../../../utils/swalUtils';

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
        showError('Không tìm thấy thông tin học sinh!');
        navigate('/student-mana');
        setLoading(false);
        return;
      }

      setStudent(found);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  return (
    <div className="p-2 bg-blue-50 min-h-screen">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/student-mana',
            title: (
              <>
                <TeamOutlined />
                <span>Quản lý học sinh</span>
              </>
            ),
          },
          {
            title: (
              <>
                <UserOutlined />
                <span className="font-semibold text-[#23408e]">Thông tin học sinh</span>
              </>
            ),
          },
        ]}
      />

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
                children: <StudentLearning student={student} playerId={student.playerId} />,
              },
              {
                key: '3',
                label: 'Thành tích',
                children: <StudentAchievements student={student} />,
              },
              {
                key: '4',
                label: 'Lịch sử',
                children: <StudentHistory playerId={student.playerId} />,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
