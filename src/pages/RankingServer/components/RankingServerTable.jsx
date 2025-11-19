import React, { useState } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Card, Avatar, Image } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, TrophyOutlined } from '@ant-design/icons';
import { getUsers } from '../../UserMana/components/userService';
import { useNavigate } from 'react-router-dom';
export default function RankingServerTable() {
  const data = getUsers();
  const navigate = useNavigate();
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredRanking = () => {
    let filtered = data.filter((user) => user.role === 'student'); // chỉ lấy học sinh

    if (inputSearchText.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(inputSearchText.toLowerCase()) ||
          item.studentCode.toLowerCase().includes(inputSearchText.toLowerCase()) ||
          item.username.toLowerCase().includes(inputSearchText.toLowerCase())
      );
    }

    return filtered.sort((a, b) => b.totalScore - a.totalScore);
  };

  const handleViewDetail = (student) => {
    console.log('Chi tiết học sinh xếp hạng:', student);
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
      align: 'center',
    },
    { title: 'Mã học sinh', dataIndex: 'code', align: 'center' },
    { title: 'Họ tên', dataIndex: 'name', align: 'left' },
    { title: 'Tên tài khoản', dataIndex: 'username', align: 'center' },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      align: 'center',
      render: (src) => <Image src={src} alt="avatar" width={50} height={50} style={{ borderRadius: 10, objectFit: 'cover' }} preview={false} />,
    },
    {
      title: 'Số lần làm bài',
      dataIndex: 'attempts',
      align: 'center',
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'totalScore',
      align: 'center',
      render: (score) => (
        <Tag color="gold" className="font-semibold">
          {score}
        </Tag>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      align: 'center',
      render: (rating) => {
        const color = rating === 'Tốt' ? 'green' : rating === 'Khá' ? 'blue' : 'volcano';
        return <Tag color={color}>{rating}</Tag>;
      },
    },
    { title: 'Ghi chú', dataIndex: 'note', align: 'left', ellipsis: true },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/ranking-server/view/${record.key}`)}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const top3 = filteredRanking().slice(0, 3);
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div className="bg-white p-2">
      <h1>
        {' '}
        <span className="text-2xl font-bold text-gray-800 select-none">Bảng xếp hạng</span>{' '}
      </h1>

      <div className="flex justify-center items-end gap-6 mb-8 mt-6 flex-wrap">
        {top3.length === 3 && (
          <>
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
              <div className="flex flex-col items-center justify-start h-full  px-2 gap-1">
                <div className="bg-gray-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md">2</div>
                <Avatar size={64} src={top3[1].avatar} className="border-4 border-white shadow-lg" />
                <div className="font-bold text-gray-800 text-base truncate w-full">{top3[1].name}</div>
                <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                  <span className="text-gray-400 font-bold text-lg">{top3[1].totalScore}</span>
                </div>
              </div>
            </Card>

            <Card
              hoverable
              className="w-64 text-center shadow-2xl border-none transform transition-all duration-300 hover:scale-110 hover:shadow-3xl"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                borderRadius: '20px',
                height: '255px',
              }}
            >
              <div className="flex flex-col items-center justify-start h-full  px-2 gap-2">
                <TrophyOutlined className="bg-yellow-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shadow-md" />
                <Avatar size={70} src={top3[0].avatar} className="border-4 border-yellow-300 shadow-2xl ring-4 ring-white" />
                <div className="font-bold text-gray-800 text-lg truncate w-full">{top3[0].name}</div>
                <div className="bg-white px-5 py-1.5 rounded-full shadow-md">
                  <span className="text-yellow-500 font-bold text-2xl">{top3[0].totalScore}</span>
                </div>
              </div>
            </Card>

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
              <div className="flex flex-col items-center justify-start h-full  px-2 gap-1">
                <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md">3</div>
                <Avatar size={64} src={top3[2].avatar} className="border-4 border-white shadow-lg" />
                <div className="font-bold text-gray-800 text-base truncate w-full">{top3[2].name}</div>
                <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                  <span className="text-orange-600 font-bold text-lg">{top3[2].totalScore}</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 220 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Tìm
          </Button>
          <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} />
        </Space.Compact>
        <Button
          type="default"
          icon={<FileExcelOutlined />}
          style={{
            backgroundColor: '#52c41a',
            color: '#fff',
            borderColor: '#52c41a',
          }}
        >
          Xuất Excel
        </Button>
      </div>
      <Table
        dataSource={filteredRanking().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        rowKey="key"
        // rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />

      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">Đã chọn: {selectedRowKeys.length} bản ghi</div>
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
    </div>
  );
}
