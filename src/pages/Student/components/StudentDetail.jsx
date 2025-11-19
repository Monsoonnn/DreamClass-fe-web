import React, { useEffect, useState } from 'react';
import { Tabs, Spin, Breadcrumb } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import StudentInfo from './StudentInfo';
import StudentLearning from './StudentLearning';
import { getStudentById } from './StudentService';
export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // lấy dữ liệu theo id
  useEffect(() => {
    const found = getStudentById(id);

    if (!found) {
      navigate('/student-mana');
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
      <Breadcrumb className="py-2 px-2 font-semibold text-[#23408e]" items={[{ href: '/student-mana', title: 'Danh sách học sinh' }, { title: 'Chi tiết học sinh' }]} />

      {/* <h2 className="text-xl font-semibold mb-4 text-[#23408e]">Thông tin chi tiết học sinh</h2> */}

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
