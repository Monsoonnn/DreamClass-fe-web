import React, { useEffect, useState } from 'react';
import { Tabs, Spin, Breadcrumb } from 'antd';
import { OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import UserInfo from '../../UserMana/components/UserInfo';
import UserLearning from '../../Student/components/StudentLearning';
import UserAchievements from '../../UserMana/components/UserAchievements';
import { apiClient } from '../../../services/api.js';

export default function RankingServerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStudentById = async (playerID) => {
    try {
      // Gọi API số 1
      const response = await apiClient.get(`/players/admin/players/${playerID}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching player data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const found = await getStudentById(id);

      if (!found) {
        // Xử lý nếu không tìm thấy, có thể navigate về hoặc hiện thông báo
        // navigate('/ranking-server');
        setLoading(false);
        return;
      }

      setUser(found);
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
            href: '/ranking-server',
            title: (
              <>
                <TeamOutlined />
                <span>Bảng xếp hạng</span>
              </>
            ),
          },
          {
            title: (
              <>
                <OrderedListOutlined />
                <span className="font-semibold text-[#23408e]">Thông tin học sinh</span>
              </>
            ),
          },
        ]}
      />

      <div className="bg-white shadow p-2">
        {user && (
          <Tabs
            className="font-medium text-[#23408e]"
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Thông tin học sinh',
                children: <UserInfo user={user} />,
              },
              {
                key: '2',
                label: 'Học tập',
                // Truyền cả user và id để bên trong gọi API lịch sử
                children: <UserLearning user={user} playerId={user._id} />,
              },
              {
                key: '3',
                label: 'Thành tích',
                children: <UserAchievements user={user} />,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
