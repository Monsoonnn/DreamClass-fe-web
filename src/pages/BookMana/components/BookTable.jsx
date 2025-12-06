import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Pagination, Popconfirm, Spin, message, Tag, Select, Modal } from 'antd';
import { EyeOutlined, SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
import EditBookModal from './BookEdit';
import * as XLSX from 'xlsx';

const { Option } = Select;

export default function BookTable() {
  const [books, setBooks] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/pdfs/list/books');
      const data = res.data?.data || [];

      const mapped = data.map((item) => ({
        key: item._id,
        name: item.title,
        category: item.category,
        level: item.grade,
        pages: item.pages,
        description: item.description,
        note: item.note,
        filePath: item.pdfUrl,
      }));

      setBooks(mapped);
      message.success(`Đã tải ${mapped.length} sách`);
    } catch (err) {
      console.error('Lỗi fetch sách:', err);
      message.error('Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = () => {
    let list = books;

    if (filterCategory !== 'all') {
      list = list.filter(b => b.category === filterCategory);
    }

    if (filterLevel !== 'all') {
      list = list.filter(b => String(b.level) === String(filterLevel));
    }

    if (!inputSearch.trim()) return list;

    return list.filter((b) => b.name.toLowerCase().includes(inputSearch.toLowerCase()) || b.category?.toLowerCase().includes(inputSearch.toLowerCase()));
  };

  const handleDelete = async (record) => {
    const backup = [...books];

    try {
      const updated = books.filter((b) => b.key !== record.key);
      setBooks(updated);
      setSelectedRowKeys((keys) => keys.filter((k) => k !== record.key));
      await apiClient.delete(`/pdfs/${record.key}`);

      message.success('Xóa sách thành công');
    } catch (err) {
      console.error('Delete failed:', err);
      setBooks(backup); // Rollback nếu lỗi
      message.error(err.response?.data?.message || 'Xóa sách thất bại!');
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sách để xóa');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} sách đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map(id => apiClient.delete(`/pdfs/${id}`))
          );
          message.success('Đã xóa các sách đã chọn');
          fetchBooks();
          setSelectedRowKeys([]);
        } catch (err) {
          console.error(err);
          message.error('Có lỗi xảy ra khi xóa nhiều sách');
          fetchBooks();
        }
      },
    });
  };

  const handleExport = () => {
    const listToExport = filteredBooks();
    if (listToExport.length === 0) {
      message.warning('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = listToExport.map((item, index) => ({
      'STT': index + 1,
      'Tên sách': item.name,
      'Nhà xuất bản': item.category,
      'Khối học': item.level,
      'Mô tả': item.description,
      'Ghi chú': item.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách sách');

    XLSX.writeFile(workbook, 'Danh_sach_sach.xlsx');
    message.success('Xuất Excel thành công');
  };

  const columns = [
    { title: 'STT', render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, width: 60, align: 'center' },
    { title: 'Tên sách', dataIndex: 'name' },
    { title: 'Nhà xuất bản', dataIndex: 'category', align: 'center' },
    {
      title: 'Khối',
      dataIndex: 'level',
      align: 'center',
      render: (level) => <Tag color="blue">{level}</Tag>,
    },
    { title: 'Mô tả', dataIndex: 'description', align: 'center' },
    { title: 'Ghi chú', dataIndex: 'note' },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => window.open(record.filePath, '_blank')} />

          <EditOutlined
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => {
              setCurrentBook(record);
              setEditModalVisible(true);
            }}
          />

          <Popconfirm title="Xóa sách này?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Get unique categories and levels for filter options
  const uniqueCategories = [...new Set(books.map(item => item.category).filter(Boolean))];
  const uniqueLevels = [...new Set(books.map(item => item.level).filter(Boolean))];

  return (
    <div className="bg-white p-3">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
            <Space.Compact className="w-full max-w-xl">
              <Input placeholder="Tìm kiếm..." value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} style={{ width: 200 }} />
              <Select 
                defaultValue="all" 
                style={{ width: 120 }} 
                onChange={setFilterCategory}
              >
                <Option value="all">Tất cả NXB</Option>
                {uniqueCategories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
              </Select>
              <Select 
                defaultValue="all" 
                style={{ width: 120 }} 
                onChange={setFilterLevel}
              >
                <Option value="all">Tất cả Khối</Option>
                {uniqueLevels.map(lvl => <Option key={lvl} value={lvl}>{lvl}</Option>)}
              </Select>
              <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                Tìm
              </Button>
            </Space.Compact>

            <Space.Compact>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/book-mana/add')}>
                Thêm mới
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDeleteMultiple}>
                Xóa
              </Button>
              <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={handleExport}>
                Xuất Excel
              </Button>
            </Space.Compact>
          </div>

          {/* Bảng */}
          <Table
            dataSource={filteredBooks().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            columns={columns}
            pagination={false}
            rowKey="key"
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            bordered
            size="small"
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span>Đã chọn: {selectedRowKeys.length} bản ghi</span>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredBooks().length}
              onChange={(p, s) => {
                setCurrentPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={['5', '10', '20', '50']}
            />
          </div>

          {editModalVisible && currentBook && (
            <EditBookModal
              visible={editModalVisible}
              onClose={() => setEditModalVisible(false)}
              bookKey={currentBook.key}
              bookData={currentBook}
              onUpdate={fetchBooks}
            />
          )}
        </>
      )}
    </div>
  );
}