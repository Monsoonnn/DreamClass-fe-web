import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Avatar } from 'antd';
import { UserOutlined, ReadOutlined, RocketOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/dateUtil';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import services to get mock data
import { getStudents } from '../Student/components/StudentService';
import { getUsers } from '../UserMana/components/userService';
import { loadBooks } from '../BookMana/components/BookService';
import { getMissions } from '../Mission/components/MissionService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalBooks: 0,
    totalMissions: 0,
  });
  const [gradeData, setGradeData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    const students = getStudents();
    const users = getUsers();
    const teachers = users.filter(u => u.role === 'teacher');
    const books = loadBooks();
    const missions = getMissions();

    setStats({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalBooks: books.length,
      totalMissions: missions.length,
    });

    const gradeCounts = {};
    students.forEach(s => {
      const grade = s.level || s.grade || 'Khác';
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    const gradeChartData = Object.keys(gradeCounts).map(key => ({
      name: `Khối ${key}`,
      count: gradeCounts[key]
    })).sort((a, b) => a.name.localeCompare(b.name));
    setGradeData(gradeChartData);

    const genderCounts = { Nam: 0, Nữ: 0, Khác: 0 };
    students.forEach(s => {
      const g = s.gender || 'Khác';
      if (genderCounts[g] !== undefined) genderCounts[g]++;
      else genderCounts['Khác']++;
    });
    setGenderData([
      { name: 'Nam', value: genderCounts.Nam },
      { name: 'Nữ', value: genderCounts.Nữ },
    ]);

    setRecentStudents(students.slice(0, 10)); // Lấy nhiều hơn để test scroll
  }, []);

  const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" src={record.avatar || "https://joeschmoe.io/api/v1/random"} />
          <span className="font-medium truncate">{text}</span>
        </div>
      )
    },
    { title: 'Lớp', dataIndex: 'class', key: 'class', align: 'center', width: 80 },
    { 
      title: 'Xếp loại', 
      dataIndex: 'rating', 
      key: 'rating',
      align: 'center',
      width: 100,
      render: (rating) => {
        let color = 'default';
        if (rating === 'Tốt' || rating === 'Giỏi') color = 'green';
        if (rating === 'Khá') color = 'blue';
        if (rating === 'Trung bình') color = 'orange';
        return <Tag color={color}>{rating}</Tag>
      }
    },
  ];

  // Shared styles
  const cardStyles = {
    className: "h-full flex flex-col shadow-sm hover:shadow-md transition-all",
    headStyle: { minHeight: '40px', padding: '0 12px', fontSize: '14px', fontWeight: '600' },
    bodyStyle: { flex: 1, padding: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
  };

  return (
    <div className="p-2 h-full flex flex-col gap-2 overflow-hidden bg-slate-50">
      {/* 1. Header & Title */}
      <div className="shrink-0 flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-[#23408e] m-0">Dashboard</h2>
        <span className="text-xs text-gray-500">{formatDate(new Date())}</span>
      </div>
      
      {/* 2. Statistics (Compact) */}
      <div className="shrink-0">
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Card size="small" bordered={false} className="shadow-sm">
              <Statistic 
                title={<span className="text-xs text-gray-500">Học Sinh</span>}
                value={stats.totalStudents} 
                prefix={<TeamOutlined className="text-blue-500" />} 
                valueStyle={{ fontSize: '18px', fontWeight: 'bold', color: '#23408e' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" bordered={false} className="shadow-sm">
              <Statistic 
                title={<span className="text-xs text-gray-500">Giáo Viên</span>}
                value={stats.totalTeachers} 
                prefix={<UserOutlined className="text-green-500" />} 
                valueStyle={{ fontSize: '18px', fontWeight: 'bold', color: '#389e0d' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" bordered={false} className="shadow-sm">
              <Statistic 
                title={<span className="text-xs text-gray-500">Sách</span>}
                value={stats.totalBooks} 
                prefix={<ReadOutlined className="text-orange-500" />} 
                valueStyle={{ fontSize: '18px', fontWeight: 'bold', color: '#d46b08' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" bordered={false} className="shadow-sm">
              <Statistic 
                title={<span className="text-xs text-gray-500">Nhiệm vụ</span>}
                value={stats.totalMissions} 
                prefix={<RocketOutlined className="text-purple-500" />} 
                valueStyle={{ fontSize: '18px', fontWeight: 'bold', color: '#531dab' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 3. Main Content Area (Single Row) */}
      <div className="flex-1 min-h-0 flex gap-2 pb-1">
        {/* Item 1: Grade Distribution */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Card title="Phân bố khối" bordered={false} {...cardStyles}>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                  <YAxis tick={{fontSize: 10}} width={30} allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="count" name="SL" fill="#23408e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Item 2: Gender Distribution */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Card title="Giới tính" bordered={false} {...cardStyles}>
             <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="70%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Item 3: Recent Students Table */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Card 
            title={<div className="flex items-center gap-2 truncate"><TrophyOutlined className="text-yellow-500" /> Học sinh tiêu biểu</div>} 
            bordered={false} 
            {...cardStyles}
          >
             <div className="flex-1 overflow-hidden">
                <Table 
                  columns={columns} 
                  dataSource={recentStudents} 
                  pagination={false} 
                  rowKey="key"
                  size="small"
                  scroll={{ x: 'max-content', y: '100%' }}
                  className="h-full"
                />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
