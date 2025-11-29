import React, { useEffect, useState } from 'react';
import { Tabs, Spin, Breadcrumb } from 'antd';
import { OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import UserInfo from '../../UserMana/components/UserInfo';
import UserLearning from '../../Student/components/StudentLearning';
import { getUsers } from '../../UserMana/components/userService';
import UserAchievements from '../../UserMana/components/UserAchievements';

export default function RankingServerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy học sinh theo id
  const getStudentById = (key) => {
    const found = getUsers().find((u) => u.key === key && u.role === 'student');
    return found || null;
  };

  useEffect(() => {
    const found = getStudentById(id);

    if (!found) {
      navigate('/ranking-server'); // nếu không tìm thấy
      return;
    }

    setUser(found);
    setLoading(false);
  }, [id, navigate]);

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
        <Tabs
          className="font-medium text-[#23408e]"
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Thông tin học sinh',
              children: <UserInfo user={user} />, // truyền prop user
            },
            {
              key: '2',
              label: 'Học tập',
              children: <UserLearning student={user} />, // giữ tên student nếu UserLearning vẫn dùng student
            },
            {
              key: '3',
              label: 'Thành tích',
              children: <UserAchievements user={user} />, // giữ tên student nếu UserLearning vẫn dùng student
            },
          ]}
        />
      </div>
    </div>
  );
}
