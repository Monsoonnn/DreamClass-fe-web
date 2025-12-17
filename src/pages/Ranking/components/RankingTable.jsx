// src/pages/ranking/RankingClass.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Card, Avatar, Image, message } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, TrophyOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useAuth } from '../../../context/AuthContext';

export default function RankingClass() {
  const [classInput, setClassInput] = useState('');
  const [className, setClassName] = useState(null);
  const [data, setData] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch API ranking theo lớp
  const fetchRanking = async (clsName) => {
    if (!clsName) return;
    
    setLoading(true);
    setData([]);
    setCurrentPage(1);

    try {
      const res = await apiClient.get(`/ranking/class/${clsName}`);
      setData(res.data?.data || []);
      setClassName(clsName);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải bảng xếp hạng theo lớp');
      setClassName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    const cls = (classInput || '').trim();
    if (!cls) return message.warning('Vui lòng nhập tên lớp (ví dụ: 10A1, 17A1...)');
    fetchRanking(cls);
  };

  useEffect(() => {
    if (user?.role === 'teacher' && user.assignedClasses?.length > 0) {
      const teacherClass = user.assignedClasses[0].className;
      setClassInput(teacherClass);
      fetchRanking(teacherClass);
    }
  }, [user]);

  // filter + sort
  const filteredRanking = () => {
    let filtered = data || [];

    if (inputSearchText.trim()) {
      const q = inputSearchText.toLowerCase();
      filtered = filtered.filter(
        (item) => (item.name || '').toLowerCase().includes(q) || (item.playerId || '').toLowerCase().includes(q) || (item.className || '').toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => (a.rank || 0) - (b.rank || 0));
  };

  const handleExport = () => {
    const listToExport = filteredRanking();
    if (listToExport.length === 0) {
      message.warning('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = listToExport.map((item) => ({
      Hạng: item.rank,
      'Tên học sinh': item.name,
      Lớp: item.className,
      Khối: item.grade,
      'Tổng điểm': item.points,
      'Số bài đã làm': item.totalExercisesCompleted,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng xếp hạng');

    XLSX.writeFile(workbook, 'Bang_xep_hang.xlsx');
    message.success('Xuất Excel thành công');
  };

  const paginatedData = filteredRanking().slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    { title: 'Hạng', dataIndex: 'rank', align: 'center', width: 80, render: (rank) => <Tag color="gold">{rank}</Tag> },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      align: 'center',
      render: (src) => <Image src={src} width={50} height={50} style={{ borderRadius: 10, objectFit: 'cover' }} preview={false} />,
    },
    { title: 'Tên học sinh', dataIndex: 'name' },
    { title: 'Lớp', dataIndex: 'className', align: 'center' },
    { title: 'Khối', dataIndex: 'grade', align: 'center' },
    { title: 'Tổng điểm', dataIndex: 'points', align: 'center', render: (score) => <Tag color="gold">{score}</Tag> },
    { title: 'Số bài đã làm', dataIndex: 'totalExercisesCompleted', align: 'center', render: (v) => <Tag color="blue">{v}</Tag> },
    // {
    //   title: 'Đánh giá',
    //   dataIndex: 'rating',
    //   align: 'center',
    //   render: (rating) => {
    //     const color = rating === 'Good' ? 'green' : rating === 'Medium' ? 'blue' : rating === 'Poor' ? 'volcano' : 'default';
    //     return <Tag color={color}>{rating || '-'}</Tag>;
    //   },
    // },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/ranking-mana/view/${record.playerId}`)}>
          Xem
        </Button>
      ),
    },
  ];

  const allRanking = filteredRanking();

  // Nếu có đúng 2 học sinh thì chỉ hiển thị top 1
  const top3 = allRanking.length === 2 ? allRanking.slice(0, 1) : allRanking.slice(0, 3);

  const isTeacher = user?.role === 'teacher';

  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 m-0">
          {isTeacher && className ? `Bảng xếp hạng lớp ${className}` : 'Bảng xếp hạng theo lớp'}
        </h1>
        {isTeacher && className && <Tag color="blue">Lớp chủ nhiệm</Tag>}
      </div>

      {/* INPUT LỚP - Chỉ hiện nếu không phải giáo viên */}
      {!isTeacher && (
        <div className="flex justify-center mb-6">
          <Space>
            <Input
              placeholder="Nhập tên lớp của bạn ..."
              style={{ width: 260 }}
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              onPressEnter={handleFetch}
            />
            <Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={handleFetch}>
              Xem bảng xếp hạng
            </Button>
          </Space>
        </div>
      )}

      {className !== null && (
        <>
          {/* TOP 3 CARDS (giống ranking grade) */}
          <div className="flex justify-center items-end gap-6 mb-8 mt-2 flex-wrap">
            {top3.length >= 1 && (
              <>
                {/* Hạng 2 (nếu có >=2 và không phải trường hợp đúng 2 học sinh) */}
                {top3[1] && allRanking.length !== 2 && (
                  <Card
                    hoverable
                    className="w-56 text-center shadow-xl border-none transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%)',
                      borderRadius: '16px',
                      height: '215px',
                      transform: 'translateY(10px)',
                    }}
                  >
                    <div className="flex flex-col items-center h-full px-2 gap-1">
                      <div className="bg-gray-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                      <Avatar size={64} src={top3[1].avatar} className="border-4 border-white shadow-lg" />
                      <div className="font-bold text-gray-800 text-base truncate w-full">{top3[1].name}</div>
                      <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                        <span className="text-gray-500 font-bold text-lg">{top3[1].points}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Hạng 1 */}
                <Card
                  hoverable
                  className="w-64 text-center shadow-2xl border-none transform transition-all duration-300 hover:scale-110 hover:shadow-3xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '20px',
                    height: '255px',
                  }}
                >
                  <div className="flex flex-col items-center px-2 gap-2">
                    <TrophyOutlined className="bg-yellow-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md" />
                    <Avatar size={70} src={top3[0].avatar} className="border-4 border-yellow-300 shadow-2xl ring-4 ring-white" />
                    <div className="font-bold text-gray-800 text-lg truncate w-full">{top3[0].name}</div>
                    <div className="bg-white px-5 py-1.5 rounded-full shadow-md">
                      <span className="text-yellow-500 font-bold text-2xl">{top3[0].points}</span>
                    </div>
                  </div>
                </Card>

                {/* Hạng 3 (nếu có >=3 và không phải trường hợp đúng 2 học sinh) */}
                {top3[2] && allRanking.length !== 2 && (
                  <Card
                    hoverable
                    className="w-56 text-center shadow-xl border-none transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #E8956C 0%, #CD7F32 100%)',
                      borderRadius: '16px',
                      height: '215px',
                      transform: 'translateY(10px)',
                    }}
                  >
                    <div className="flex flex-col items-center h-full px-2 gap-1">
                      <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                      <Avatar size={64} src={top3[2].avatar} className="border-4 border-white shadow-lg" />
                      <div className="font-bold text-gray-800 text-base truncate w-full">{top3[2].name}</div>
                      <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                        <span className="text-orange-600 font-bold text-lg">{top3[2].points}</span>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )}
            {/* Nếu không có top nào (dữ liệu rỗng) */}
            {top3.length === 0 && <div className="text-gray-500">Không có dữ liệu cho lớp {className}</div>}
          </div>

          {/* SEARCH + BUTTON */}
          <div className="flex justify-end items-center flex-wrap mb-3 gap-2">
            {/* <Space.Compact className="w-full max-w-xl">
              <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 220 }} />
              <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                Tìm
              </Button> */}
            {/* <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} /> */}
            {/* </Space.Compact> */}

            <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={handleExport}>
              Xuất Excel
            </Button>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-auto">
            <Table dataSource={paginatedData} columns={columns} pagination={false} loading={loading} rowKey="playerId" size="small" bordered scroll={{ x: 'max-content' }} />
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end items-center mt-4 flex-wrap gap-2 m-2">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredRanking().length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={['5', '10', '20', '50']}
            />
          </div>
        </>
      )}
    </div>
  );
}
