import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Pagination, Popconfirm, Spin, message, Tag, Breadcrumb } from 'antd';
import { EyeOutlined, SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
// import EditBookModal from './BookEdit';

export default function StudentBook() {
  const [books, setBooks] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

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
    if (!inputSearch.trim()) return books;

    return books.filter((b) => b.name.toLowerCase().includes(inputSearch.toLowerCase()) || b.category?.toLowerCase().includes(inputSearch.toLowerCase()));
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
      // Rollback nếu lỗi
      setBooks(backup);
      message.error(err.response?.data?.message || 'Xóa sách thất bại!');
    }
  };

  const columns = [
    { title: 'STT', render: (_, __, index) => index + 1, width: 60, align: 'center' },
    { title: 'Tên sách', dataIndex: 'name' },
    { title: 'Nhà xuất bản', dataIndex: 'category', align: 'center' },
    {
      title: 'Khối',
      dataIndex: 'level',
      align: 'center',
      render: (level) => <Tag color="blue">{level}</Tag>,
    },
    { title: 'Mô tả', dataIndex: 'description', align: 'center' },
    // { title: 'Ghi chú', dataIndex: 'note' },
    {
      title: 'Xem sách',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => window.open(record.filePath, '_blank')} />

          {/* <EditOutlined
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => {
              setCurrentBook(record);
              setEditModalVisible(true);
            }}
          /> */}

          {/* <Popconfirm title="Xóa sách này?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-3">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div>
            <Breadcrumb
              className="mb-4 text-sm"
              items={[
                {
                  href: '/book-mana',
                  title: (
                    <>
                      <UserOutlined />
                      <span>Quản lý bài trắc nghiệm</span>
                    </>
                  ),
                },
                {
                  title: (
                    <>
                      <UnorderedListOutlined />
                      <span className="font-semibold text-[#23408e]">Danh sách bài trắc nghiệm</span>
                    </>
                  ),
                },
              ]}
            />
          </div>
          <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
            <Space.Compact className="w-full max-w-xl">
              <Input placeholder="Tìm kiếm..." value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} style={{ width: 220 }} />

              <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                Tìm
              </Button>
            </Space.Compact>

            <Space.Compact>
              {/* <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/book-mana/add')}>
                Thêm mới
              </Button> */}
            </Space.Compact>
          </div>

          {/* Bảng */}
          <Table
            dataSource={filteredBooks().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            columns={columns}
            pagination={false}
            rowKey="key"
            // rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            bordered
            size="small"
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span>{/* Đã chọn: {selectedRowKeys.length} bản ghi */}</span>

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
            <EditBookModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} bookKey={currentBook.key} onUpdate={fetchBooks} />
          )}
        </>
      )}
    </div>
  );
}
