import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Avatar, Popconfirm, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from './userService';
import { apiClient } from '../../../services/api';

export default function UserTable({ filterRole }) {
  const [data, setData] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Fetch dữ liệu từ API ---
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/players/admin/players', {
        params: {
          page: 1, // luôn lấy tất cả dữ liệu backend
          limit: 1000, // hoặc số lượng tối đa bạn muốn load
          search: inputSearchText,
          status: status,
        },
      });

      console.log('Players API Response:', response.data);
      setData(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
      message.error('Không thể tải dữ liệu từ server. Sử dụng dữ liệu tạm thời.');
      setData(getUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [inputSearchText, status]);

  // --- Filter theo role và search ---
  const filteredList = () => {
    let list = data;
    if (filterRole) {
      list = list.filter((item) => item.role === filterRole);
    }
    if (inputSearchText.trim()) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(inputSearchText.toLowerCase()) ||
          item.code?.toLowerCase().includes(inputSearchText.toLowerCase()) ||
          item.username?.toLowerCase().includes(inputSearchText.toLowerCase())
      );
    }
    return list;
  };

  // --- Delete ---
  const handleDelete = (record) => {
    const id = record.playerId || record._id || record.key;
    try {
      deleteUser(id);
      message.success('Xóa thành công');
      fetchPlayers(); // refresh data từ API
      setSelectedRowKeys([]);
    } catch (err) {
      console.warn('Delete failed', id, err);
      message.error('Xóa thất bại');
    }
  };

  const renderRole = (role) => (role === 'teacher' ? <Tag color="blue">Giáo viên</Tag> : <Tag color="green">Học sinh</Tag>);

  const columns = [
    { title: 'STT', key: 'index', align: 'center', render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: 'Avatar', dataIndex: 'avatar', key: 'avatar', align: 'center', render: (avatar) => <Avatar src={avatar} className="w-10 h-10 rounded-full" /> },
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
    { title: 'Phân loại', dataIndex: 'role', key: 'role', align: 'center', render: renderRole },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes', ellipsis: true, align: 'center' },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate(`/user-mana/view/${record.playerId || record._id || record.key}`)} />
          {/* <EditOutlined style={{ color: 'blue', cursor: 'pointer' }} onClick={() => console.log('Sửa:', record)} /> */}
          <Popconfirm title="Bạn có chắc muốn xoá?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- Slice dữ liệu theo phân trang frontend ---
  const paginatedData = filteredList().slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white p-3">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 240 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => setCurrentPage(1)}>
            Tìm
          </Button>
          <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} />
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/user-mana/add')}>
            Thêm
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Xóa
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
          rowKey={(record) => record.playerId || record._id || record.key}
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
