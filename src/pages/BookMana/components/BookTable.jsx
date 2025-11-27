import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Pagination, message, Popconfirm } from 'antd';
import { EditOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { loadBooks, getBookByKey, deleteBook } from './BookService';
import { useNavigate } from 'react-router-dom';

export default function BookTable() {
  // STATE
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  // Load dữ liệu khi component mount
  useEffect(() => {
    setBooks(loadBooks());
  }, []);

  // Lọc sách theo searchText
  const filteredList = () => {
    if (!searchText.trim()) return books;
    return books.filter((book) => book.name.toLowerCase().includes(searchText.toLowerCase()) || book.code.toLowerCase().includes(searchText.toLowerCase()));
  };

  // Xem chi tiết sách

  // Xóa sách
  const handleDelete = (record) => {
    deleteBook(record.key); // xóa trong localStorage
    setBooks(loadBooks()); // cập nhật lại state books
    setSelectedRowKeys((prev) => prev.filter((k) => k !== record.key)); // bỏ khỏi selection
    message.success('Xóa sách thành công');
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mã sách',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: 'Tên sách',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Khối học',
      dataIndex: 'level',
      align: 'center',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: 'File sách',
      dataIndex: 'filePath',
      align: 'center',
      render: (filePath) =>
        filePath ? (
          <a href={filePath} target="_blank" rel="noreferrer" className="text-[#23408E] font-medium">
            Mở file
          </a>
        ) : (
          'Chưa có'
        ),
    },

    {
      title: 'Ghi chú',
      dataIndex: 'note',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EditOutlined style={{ color: 'blue', cursor: 'pointer' }} />
          <Popconfirm title="Bạn có chắc muốn xoá?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-3">
      {/* HEADER: Tìm kiếm + Thêm + Xuất Excel */}
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Tìm theo tên hoặc mã sách..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 260 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Tìm
          </Button>
          <Button type="primary" icon={<FilterOutlined />} />
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/book-mana/add')}>
            Thêm mới
          </Button>
          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff' }}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      {/* BẢNG SÁCH */}
      <Table
        dataSource={filteredList().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        rowKey="key"
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 'max-content' }}
        bordered
        size="small"
      />

      {/* PHÂN TRANG + THỐNG KÊ */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">Đã chọn: {selectedRowKeys.length} sách</div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredList().length}
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
