import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Avatar, Popconfirm, message, Select, Modal } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from './userService';
import { apiClient } from '../../../services/api';
import * as XLSX from 'xlsx';
import UserUpdate from './UserUpdate';

const { Option } = Select;

export default function UserTable({ filterRole }) {
  const [data, setData] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');

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
    if (filterGrade) {
      list = list.filter((item) => item.grade === filterGrade);
    }
    if (filterClass) {
      list = list.filter((item) => item.className === filterClass);
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

  const handleDelete = async (record) => {
    const id = record.playerId || record._id || record.key;
    try {
      await apiClient.delete(`/accounts/students/${id}`);
      message.success('Xóa thành công');
      fetchPlayers(); // Refresh data từ API
      setSelectedRowKeys([]); // Reset selected rows
    } catch (err) {
      console.warn('Delete failed', id, err);
      message.error('Xóa thất bại');
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một người dùng để xóa');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} người dùng đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map(async (key) => {
              await apiClient.delete(`/accounts/students/${key}`);
            })
          );
          message.success('Đã xóa các người dùng đã chọn');
          fetchPlayers();
          setSelectedRowKeys([]);
        } catch (err) {
          console.error('Delete multiple failed', err);
          message.error('Xóa thất bại một số bản ghi');
          fetchPlayers(); // Refresh anyway
        }
      },
    });
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    setEditModalVisible(true);
  };

  const handleExport = () => {
    const listToExport = filteredList();
    if (listToExport.length === 0) {
      message.warning('Không có dữ liệu để xuất Excel');
      return;
    }
    const exportData = listToExport.map((item, index) => ({
      STT: index + 1,
      'Họ tên': item.name,
      'Tài khoản': item.username,
      Email: item.email,
      'Giới tính': item.gender === 'Male' ? 'Nam' : item.gender === 'Female' ? 'Nữ' : item.gender,
      'Ngày sinh': item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('vi-VN') : '',
      'Địa chỉ': item.address,
      'Số điện thoại': item.phone,
      Lớp: item.className,
      Khối: item.grade,
      'Ghi chú': item.notes,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');

    XLSX.writeFile(workbook, 'Danh_sach_hoc_sinh.xlsx');
    message.success('Xuất Excel thành công');
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
          <EditOutlined style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleEdit(record)} />
          <Popconfirm title="Bạn có chắc muốn xoá?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- Slice dữ liệu theo phân trang frontend ---
  const paginatedData = filteredList().slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Get unique grades and classes for filter options
  const uniqueGrades = [...new Set(data.map((item) => item.grade).filter(Boolean))];
  const uniqueClasses = [...new Set(data.map((item) => item.className).filter(Boolean))];

  return (
    <div className="bg-white p-3">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 200 }} />
          <Select placeholder="Lọc Khối" style={{ width: 120 }} allowClear onChange={(value) => setFilterGrade(value)}>
            {uniqueGrades.map((g) => (
              <Option key={g} value={g}>
                {g}
              </Option>
            ))}
          </Select>
          <Select placeholder="Lọc Lớp" style={{ width: 120 }} allowClear onChange={(value) => setFilterClass(value)}>
            {uniqueClasses.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => setCurrentPage(1)}>
            Tìm
          </Button>
          {/* <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} /> */}
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/user-mana/add')}>
            Thêm
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteMultiple}>
            Xóa
          </Button>
          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={handleExport}>
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

      <UserUpdate open={editModalVisible} onClose={() => setEditModalVisible(false)} userData={editingUser} onUpdated={fetchPlayers} />
    </div>
  );
}
