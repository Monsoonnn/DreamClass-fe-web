// src/pages/user-mana/components/TeacherTable.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Avatar, Popconfirm, message } from 'antd';
import { EyeOutlined, DeleteOutlined, FileExcelOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';

export default function TeacherTable() {
  const [data, setData] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Fetch dữ liệu giáo viên từ API ---
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/accounts/teachers', {
        params: {
          page: currentPage,
          limit: pageSize,
          search: inputSearchText || undefined,
        },
      });

      const teachers = response.data?.data || [];
      const pagination = response.data?.pagination || { total: teachers.length };
      setData(teachers);
      setTotal(pagination.total || teachers.length);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      message.error('Không thể tải dữ liệu từ server.');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, inputSearchText]);

  // --- Delete ---
  const handleDelete = async (record) => {
    const id = record.teacherId || record._id || record.key;
    try {
      // optimistic UI: remove locally first
      setData((prev) => prev.filter((t) => (t.teacherId || t._id || t.key) !== id));
      setSelectedRowKeys([]);

      const res = await apiClient.delete(`/accounts/teachers/${id}`);
      console.log('Delete teacher response:', res.data);
      message.success('Xóa thành công');

      // fetch fresh list from server to sync
      fetchTeachers();
    } catch (err) {
      console.warn('Delete failed', id, err);
      message.error('Xóa thất bại');
      // refresh to restore
      fetchTeachers();
    }
  };

  const renderRole = () => <Tag color="blue">Giáo viên</Tag>;

  const columns = [
    { title: 'STT', key: 'index', align: 'center', render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      render: (avatar) => {
        const safeSrc = avatar && avatar.trim() !== '' ? avatar : '/avatar-default.png';
        return <Avatar src={safeSrc} className="w-10 h-10 rounded-full" />;
      },
    },

    { title: 'Họ tên', dataIndex: 'name', key: 'name', align: 'center' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', align: 'center' },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      align: 'center',
      render: (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      },
    },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', align: 'center' },
    { title: 'Tài khoản', dataIndex: 'username', key: 'username', align: 'center' },
    { title: 'Phân loại', key: 'role', align: 'center', render: renderRole },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes', ellipsis: true, align: 'center' },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate(`/user-mana/view-teacher/${record.teacherId || record._id || record.key}`)} />
          <Popconfirm title="Bạn có chắc muốn xoá?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const paginatedData = data.filter(
    (item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()) || item.username?.toLowerCase().includes(inputSearchText.toLowerCase())
  );

  return (
    <div className="bg-white p-3">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 240 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => setCurrentPage(1)}>
            Tìm
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/user-mana/add')}>
            Thêm
          </Button>
          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      <div className="w-full overflow-auto">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.teacherId || record._id || record.key}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          scroll={{ x: 'max-content' }}
          bordered
          size="small"
          loading={loading}
        />
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">
          <span>Đã chọn: {selectedRowKeys.length} bản ghi</span>
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data.length}
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
