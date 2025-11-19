import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Avatar, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from './userService';

export default function UserTable() {
  const [data, setData] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    setData(getUsers());
  }, []);

  const filteredList = () => {
    if (!inputSearchText.trim()) return data;
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(inputSearchText.toLowerCase()) ||
        item.code.toLowerCase().includes(inputSearchText.toLowerCase()) ||
        item.username.toLowerCase().includes(inputSearchText.toLowerCase())
    );
  };

  const handleDelete = (record) => {
    deleteUser(record.key);
    setData(getUsers());
    setSelectedRowKeys([]);
  };

  const renderRole = (role) => (role === 'teacher' ? <Tag color="blue">Giáo viên</Tag> : <Tag color="green">Học sinh</Tag>);

  const columns = [
    { title: 'STT', key: 'index', align: 'center', width: 70, render: (_, __, index) => index + 1 },
    { title: 'Mã số', dataIndex: 'code', key: 'code', align: 'center' },
    { title: 'Avatar', dataIndex: 'avatar', key: 'avatar', align: 'center', render: (avatar) => <Avatar src={avatar} size={40} />, width: 90 },
    { title: 'Họ tên', dataIndex: 'name', key: 'name', align: 'left' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', align: 'center' },
    { title: 'Ngày sinh', dataIndex: 'dob', key: 'dob', align: 'center' },
    { title: 'Tài khoản', dataIndex: 'username', key: 'username', align: 'center' },
    { title: 'Phân loại', dataIndex: 'role', key: 'role', align: 'center', render: renderRole },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true, align: 'left' },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate(`/user-mana/view/${record.key}`)} />

          <EditOutlined style={{ color: 'blue', cursor: 'pointer' }} onClick={() => console.log('Sửa:', record)} />
          <Popconfirm title="Bạn có chắc muốn xoá?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-3">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 240 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
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
