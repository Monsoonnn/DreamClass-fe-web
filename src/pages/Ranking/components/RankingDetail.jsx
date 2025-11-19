import React, { useEffect, useState } from 'react';
import { Tabs, Spin, Breadcrumb } from 'antd';
import { OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import StudentInfo from '../../Student/components/StudentInfo';
import StudentLearning from '../../Student/components/StudentLearning';
import { getStudentById } from '../../Student/components/StudentService';
export default function RankingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const found = getStudentById(id);

    if (!found) {
      navigate('/ranking-mana');
      return;
    }

    setStudent(found);
    setLoading(false);
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
            href: '/ranking-mana',
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
              children: <StudentInfo student={student} />,
            },
            {
              key: '2',
              label: 'Học tập',
              children: <StudentLearning student={student} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
