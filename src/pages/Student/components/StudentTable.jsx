import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Space, Input, Pagination } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { getStudents } from './StudentService';

export default function StudentTable() {
  const data = getStudents();
  const navigate = useNavigate();
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Lọc danh sách theo tìm kiếm
  const filteredClassList = () => {
    if (!inputSearchText.trim()) return data;
    return data.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()) || item.studentCode.toLowerCase().includes(inputSearchText.toLowerCase()));
  };

  // Xem chi tiết

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
      title: 'Mã học sinh',
      dataIndex: 'studentCode',
      key: 'studentCode',
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      align: 'center',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (status === 'Đang học' ? <Tag color="green">Đang học</Tag> : <Tag color="volcano">Nghỉ học</Tag>),
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
          <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/student-mana/view/${record.key}`)}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-2 ">
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
        dataSource={filteredClassList().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        rowKey="studentCode"
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">
          <span>Đã chọn: {selectedRowKeys.length} bản ghi</span>
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredClassList().length}
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
