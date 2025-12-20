import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Avatar, Spin, message, Empty } from 'antd';
import { UserOutlined, ReadOutlined, RocketOutlined, TrophyOutlined, TeamOutlined, SolutionOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/dateUtil';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalBooks: 0,
    totalMissions: 0,
  });
  const [gradeData, setGradeData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [teacherClassData, setTeacherClassData] = useState([]);
  const [teacherClassName, setTeacherClassName] = useState('');

  // Màu cho biểu đồ tròn
  const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

  useEffect(() => {
    if (user) {
      if (user.role === 'teacher') {
        fetchTeacherDashboard();
      } else {
        fetchAdminDashboard();
      }
    }
  }, [user]);

  const fetchTeacherDashboard = async () => {
    try {
      setLoading(true);

      // 1. Get Class Name (for ranking)
      const assignedClass = user.assignedClasses?.[0];
      const className = assignedClass?.className;
      setTeacherClassName(className || '');

      // 2. Parallel Fetching
      const [studentsRes, missionsRes, booksRes, rankingRes] = await Promise.all([
        apiClient.get('/teacher/students'),
        apiClient.get('/quests/admin/templates'),
        apiClient.get('/pdfs/list/books'),
        className ? apiClient.get(`/ranking/class/${className}`) : Promise.resolve({ data: { data: [] } }),
      ]);

      // 3. Process Data
      const studentData = studentsRes.data?.data || [];
      const missionsData = missionsRes.data?.data || []; // Assuming array format
      const booksData = booksRes.data?.data || [];
      const rankingData = rankingRes.data?.data || [];

      // Create Gender Map
      const genderMap = {};
      studentData.forEach((s) => {
        if (s.playerId) {
          genderMap[s.playerId] = s.gender;
        }
      });

      // 4. Update Stats
      setStats({
        totalStudents: studentData.length,
        totalTeachers: 0, // Not relevant for teacher
        totalMissions: missionsData.length,
        totalBooks: booksData.length,
      });

      setTeacherClassData(rankingData);

      // 5. Set Recent Students (Top 5 from ranking)
      setRecentStudents(
        rankingData.slice(0, 5).map((item) => {
          const pid = item.playerId || item._id; // ranking item usually has playerId
          return {
            key: pid,
            rank: item.rank,
            name: item.name,
            avatar: item.avatar,
            class: item.className,
            points: item.points || 0,
            gender: genderMap[pid] || 'Other',
          };
        })
      );
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
      message.error('Không thể tải dữ liệu giáo viên');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);

      // Gọi song song 5 API: Học sinh, Bảng xếp hạng, Giáo viên, Sách, Nhiệm vụ
      const [studentsRes, rankingRes, teachersRes, booksRes, questsRes] = await Promise.all([
        apiClient.get('/players/admin/players', { params: { limit: 1000 } }), // Lấy data vẽ biểu đồ
        apiClient.get('/ranking/global'), // Lấy bảng xếp hạng
        apiClient.get('/accounts/teachers', { params: { limit: 1 } }), // Chỉ cần lấy total count
        apiClient.get('/pdfs/list/books'), // Lấy danh sách sách
        apiClient.get('/quests/admin/templates'), // Lấy danh sách nhiệm vụ
      ]);

      // --- 1. Xử lý dữ liệu Học sinh ---
      const studentData = studentsRes.data.data || [];
      const studentPagination = studentsRes.data.pagination || {};

      // --- 2. Xử lý dữ liệu Giáo viên ---
      const teachersPagination = teachersRes.data?.pagination || {};
      const totalTeachersCount = teachersPagination.total || teachersRes.data?.data?.length || 0;

      // --- 3. Xử lý dữ liệu Sách ---
      // API trả về mảng data chứa các sách
      const booksList = booksRes.data?.data || [];
      const totalBooksCount = booksList.length;

      // --- 4. Xử lý dữ liệu Nhiệm vụ ---
      // API trả về field 'count' hoặc đếm mảng data
      const questsData = questsRes.data || {};
      const totalQuestsCount = questsData.count || (questsData.data ? questsData.data.length : 0);

      // Cập nhật thống kê tổng hợp
      setStats((prev) => ({
        ...prev,
        totalStudents: studentPagination.total || studentData.length,
        totalTeachers: totalTeachersCount,
        totalBooks: totalBooksCount, // Đã cập nhật từ API
        totalMissions: totalQuestsCount, // Đã cập nhật từ API
      }));

      // --- 5. Xử lý Biểu đồ Phân bố Khối ---
      const gradeCounts = {};
      studentData.forEach((s) => {
        const grade = s.grade ? s.grade : 'Khác';
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
      });

      const formattedGradeData = Object.keys(gradeCounts)
        .map((key) => ({
          name: key === 'Khác' ? 'Khác' : `Khối ${key}`,
          count: gradeCounts[key],
          originalKey: key,
        }))
        .sort((a, b) => a.originalKey.toString().localeCompare(b.originalKey.toString()));

      setGradeData(formattedGradeData);

      // --- 6. Xử lý Biểu đồ Giới tính ---
      let maleCount = 0;
      let femaleCount = 0;

      studentData.forEach((s) => {
        const g = s.gender ? s.gender.toLowerCase() : '';
        if (g === 'male' || g === 'nam') maleCount++;
        else if (g === 'female' || g === 'nữ') femaleCount++;
      });

      setGenderData([
        { name: 'Nam', value: maleCount },
        { name: 'Nữ', value: femaleCount },
      ]);

      // --- 7. Xử lý Bảng xếp hạng ---
      const rankingData = rankingRes.data?.data || [];
      const top10Ranking = rankingData.slice(0, 9).map((item) => ({
        key: item._id,
        rank: item.rank,
        name: item.name,
        avatar: item.avatar,
        class: item.className,
        points: item.points || 0,
      }));

      setRecentStudents(top10Ranking);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu Dashboard');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
      render: (rank) => <span className="font-semibold text-yellow-600">#{rank}</span>,
    },
    {
      title: 'Học sinh',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" src={record.avatar || 'https://joeschmoe.io/api/v1/random'} />
          <span className="font-medium truncate">{text}</span>
        </div>
      ),
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      align: 'center',
    },
  ];

  // Shared styles
  const cardStyles = {
    className: 'h-full flex flex-col shadow-sm hover:shadow-md transition-all',
    headStyle: { minHeight: '40px', padding: '0 12px', fontSize: '14px', fontWeight: '600' },
    bodyStyle: { flex: 1, padding: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  // --- TEACHER VIEW ---
  if (user?.role === 'teacher') {
    return (
      <div className="p-4 h-full flex flex-col gap-4  bg-blue-50">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#23408e] m-0">Tổng quan lớp {teacherClassName || '(Chưa có lớp)'}</h2>
            <p className="text-gray-500 m-0">Chào mừng, {user.name}!</p>
          </div>
          <span className="text-sm text-gray-500">{formatDate(new Date())}</span>
        </div>

        {!teacherClassName ? (
          <Empty description="Bạn chưa được phân công chủ nhiệm lớp nào." />
        ) : (
          <>
            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card bordered={false} className="shadow-sm">
                  <Statistic
                    title="Tổng số học sinh"
                    value={stats.totalStudents}
                    prefix={<TeamOutlined className="text-blue-500" />}
                    valueStyle={{ color: '#23408e', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} className="shadow-sm">
                  <Statistic
                    title="Tổng số sách"
                    value={stats.totalBooks}
                    prefix={<ReadOutlined className="text-orange-500" />}
                    valueStyle={{ color: '#d46b08', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} className="shadow-sm">
                  <Statistic
                    title="Tổng số nhiệm vụ"
                    value={stats.totalMissions}
                    prefix={<RocketOutlined className="text-purple-500" />}
                    valueStyle={{ color: '#531dab', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Content Row */}
            <Row gutter={[16, 16]} className="flex-1">
              {/* Top Students Table */}
              <Col xs={24} md={12} lg={16}>
                <Card
                  title={
                    <>
                      <TrophyOutlined className="text-yellow-500 mr-2" /> Top học sinh xuất sắc
                    </>
                  }
                  bordered={false}
                  className="shadow-sm h-full"
                >
                  <Table columns={columns} dataSource={recentStudents} pagination={false} rowKey="key" size="middle" />
                </Card>
              </Col>

              {/* Simple Chart for Top 5 Points */}
              <Col xs={24} md={12} lg={8}>
                <Card
                  title={
                    <div className="flex justify-between items-center">
                      <span>Điểm số Top 5</span>
                      <div className="flex gap-2 text-xs font-normal">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#0088FE]"></span>Nam
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#FF8042]"></span>Nữ
                        </span>
                      </div>
                    </div>
                  }
                  bordered={false}
                  className="shadow-sm h-full"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={recentStudents} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                      <RechartsTooltip />
                      <Bar dataKey="points" radius={[0, 4, 4, 0]}>
                        {recentStudents.map((entry, index) => {
                          const g = (entry.gender || '').toLowerCase();
                          let color = '#00C49F'; // Other
                          if (g === 'male' || g === 'nam') color = '#0088FE';
                          if (g === 'female' || g === 'nữ') color = '#FF8042';
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }

  // --- ADMIN VIEW (Default) ---
  return (
    <div className="p-2 h-full flex flex-col gap-2 overflow-hidden bg-slate-50">
      {/* 1. Header & Title */}
      <div className="shrink-0 flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-[#23408e] m-0">Trang chủ</h2>
        <span className="text-xs text-gray-500">Cập nhật từ: {formatDate(new Date())}</span>
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
                prefix={<SolutionOutlined className="text-purple-500" />}
                valueStyle={{ fontSize: '18px', fontWeight: 'bold', color: '#531dab' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 3. Main Content Area (Single Row) */}
      <div className="flex-1 min-h-0 flex gap-1 pb-1">
        {/* Item 1: Grade Distribution */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Card title="Phân bố khối" bordered={false} {...cardStyles}>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} width={30} allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="count" name="Số lượng" fill="#23408e" radius={[4, 4, 0, 0]} />
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
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius="40%" outerRadius="70%" paddingAngle={5} dataKey="value">
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
            title={
              <div className="flex items-center gap-2 truncate">
                <TrophyOutlined className="text-yellow-500" /> Bảng xếp hạng máy chủ
              </div>
            }
            bordered={false}
            {...cardStyles}
          >
            <div className="flex-1 overflow-hidden">
              <Table columns={columns} dataSource={recentStudents} pagination={false} rowKey="key" size="small" scroll={{ x: 'max-content' }} className="h-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
