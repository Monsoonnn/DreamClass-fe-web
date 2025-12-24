// src/pages/RankingServer/components/RankingClass.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Card, Avatar, Image, message, Breadcrumb, Select, Spin } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, TrophyOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons';
import { apiClient } from '../../../services/api';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useAuth } from '../../../context/AuthContext';

const { Option } = Select;

export default function RankingClass() {
  const [classInput, setClassInput] = useState(undefined);
  const [className, setClassName] = useState(null);
  const [data, setData] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    // Nếu là admin hoặc không phải teacher thì mới fetch list class
    if (!isTeacher) {
      const fetchClasses = async () => {
        try {
          const res = await apiClient.get('/teacher/classes');
          setClassesList(res.data?.data || []);
        } catch (err) {
          console.error('Error fetching classes:', err);
        }
      };
      fetchClasses();
    }
  }, [isTeacher]);

  useEffect(() => {
    if (isTeacher && user.assignedClasses?.length > 0) {
      const cls = user.assignedClasses[0].className;
      if (cls) {
        setClassInput(cls);
        fetchRanking(cls);
      }
    }
  }, [user, isTeacher]);

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
      showError('Không thể tải bảng xếp hạng theo lớp');
      setClassName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    const cls = (classInput || '').trim();
    if (!cls) {
      showError('Vui lòng chọn lớp');
      return;
    }
    fetchRanking(cls);
  };

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
      showError('Không có dữ liệu để xuất Excel');
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảng xếp hạng lớp');

    XLSX.writeFile(workbook, 'Bang_xep_hang_lop.xlsx');
    showSuccess('Xuất Excel thành công');
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
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/ranking-class/view/${record.playerId}`)}>
          Xem
        </Button>
      ),
    },
  ];

  const allRanking = filteredRanking();
  const top3 = allRanking.length === 2 ? allRanking.slice(0, 1) : allRanking.slice(0, 3);

  return (
    <div className="p-2">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/ranking-class',
            title: (
              <>
                <TrophyOutlined />
                <span> Xếp hạng theo lớp</span>
              </>
            ),
          },
          {
            title: (
              <>
                <TeamOutlined />
                <span className="font-semibold text-[#23408e]">Bảng xếp hạng</span>
              </>
            ),
          },
        ]}
      />
      <div className="bg-white p-2 min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-2xl font-bold text-gray-800 m-0">Bảng xếp hạng theo lớp</h1>
              {isTeacher && className && <Tag color="blue">Lớp {className} (Được phân công)</Tag>}
            </div>

            {/* INPUT LỚP - ẨN VỚI GIÁO VIÊN */}
            {!isTeacher && (
              <div className="flex justify-center mb-6">
                <Space>
                  <Select
                    placeholder="Chọn lớp"
                    style={{ width: 260 }}
                    value={classInput}
                    onChange={(val) => setClassInput(val)}
                    showSearch
                    filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                  >
                    {classesList.map((item) => {
                      const val = typeof item === 'string' ? item : item.className;
                      return (
                        <Option key={val} value={val}>
                          {val}
                        </Option>
                      );
                    })}
                  </Select>
                  <Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={handleFetch}>
                    Xem bảng xếp hạng
                  </Button>
                </Space>
              </div>
            )}

            {className !== null && (
              <>
                <div className="flex justify-center items-end gap-6 mb-8 mt-2 flex-wrap">
                  {top3.length >= 1 && (
                    <>
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
                  {top3.length === 0 && <div className="text-gray-500">Không có dữ liệu cho lớp {className}</div>}
                </div>

                <div className="flex justify-end items-center flex-wrap mb-3 gap-2">
                  <Button
                    type="default"
                    icon={<FileExcelOutlined />}
                    className="ml-auto"
                    style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}
                    onClick={handleExport}
                  >
                    Xuất Excel
                  </Button>
                </div>

                <div className="w-full overflow-auto">
                  <Table dataSource={paginatedData} columns={columns} pagination={false} loading={loading} rowKey="playerId" size="small" bordered scroll={{ x: 'max-content' }} />
                </div>

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
          </>
        )}
      </div>
    </div>
  );
}
