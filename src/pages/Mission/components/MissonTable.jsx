import React, { useState } from 'react';
import { Table, Tag, Button, Space, Input, Pagination } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';

export default function MissionTable() {
  // 🧩 Dữ liệu mẫu
  const data = [
    {
      key: '1',
      missionCode: 'Q001',
      missionName: 'Ôn tập Toán chương 1',
      createdAt: '2025-10-05',
      type: 'Ôn tập',
      reward: 50,
      status: 'Bật',
      note: 'Dành cho khối 10',
    },
    {
      key: '2',
      missionCode: 'Q002',
      missionName: 'Bài kiểm tra Sinh học tuần 3',
      createdAt: '2025-10-10',
      type: 'Kiểm tra',
      reward: 100,
      status: 'Tắt',
      note: 'Tạm dừng do cập nhật nội dung',
    },
    {
      key: '3',
      missionCode: 'Q003',
      missionName: 'Học bài: Giải phương trình bậc hai',
      createdAt: '2025-10-15',
      type: 'Học tập',
      reward: 75,
      status: 'Bật',
      note: 'Có video hướng dẫn',
    },
  ];

  // 🧠 State quản lý bảng
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 🔍 Lọc danh sách theo tìm kiếm
  const filteredMissions = () => {
    if (!inputSearchText.trim()) return data;
    return data.filter((item) => item.missionName.toLowerCase().includes(inputSearchText.toLowerCase()) || item.missionCode.toLowerCase().includes(inputSearchText.toLowerCase()));
  };

  // 👁 Xem chi tiết
  const handleViewDetail = (mission) => {
    console.log('Chi tiết nhiệm vụ:', mission);
  };

  // 🧱 Cấu hình cột bảng
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 70,
      align: 'center',
    },
    {
      title: 'Mã nhiệm vụ',
      dataIndex: 'missionCode',
      key: 'missionCode',
      align: 'center',
    },
    {
      title: 'Tên nhiệm vụ',
      dataIndex: 'missionName',
      key: 'missionName',
      align: 'left',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
    },
    {
      title: 'Loại quest',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (type) => {
        const color = type === 'Ôn tập' ? 'blue' : type === 'Học tập' ? 'green' : type === 'Kiểm tra' ? 'volcano' : 'default';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: 'Điểm thưởng',
      dataIndex: 'reward',
      key: 'reward',
      align: 'center',
      render: (reward) => <Tag color="gold">{reward}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (status === 'Bật' ? <Tag color="green">Bật</Tag> : <Tag color="volcano">Tắt</Tag>),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  // 🖼 Render giao diện
  return (
    <div className="bg-white shadow-lg p-2">
      {/* Thanh công cụ */}
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

      {/* Bảng dữ liệu */}
      <Table
        dataSource={filteredMissions().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        rowKey="key"
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />

      {/* Phân trang & Thông tin chọn */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">
          <span>Đã chọn: {selectedRowKeys.length} bản ghi</span>
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredMissions().length}
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
