import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, message, Popconfirm } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api';

export default function SpinTable() {
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/spin-wheels');
      const apiData = res.data.data;

      const mapped = apiData.map((spin) => ({
        key: spin._id,
        name: spin.name,
        description: spin.description,
        price: spin.spinPrice,
        currency: spin.currency,
        startTime: spin.startTime,
        endTime: spin.endTime,
        active: spin.isActive,
        itemCount: spin.items?.length || 0,
        raw: spin,
      }));

      setData(mapped);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải danh sách vòng quay!');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = () => {
    if (!inputSearchText.trim()) return data;
    return data.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()) || item.description.toLowerCase().includes(inputSearchText.toLowerCase()));
  };

  const handleViewDetail = (record) => {
    navigate(`/reward-spin/detail/${record.key}`);
  };

  const handleDeleteSpin = async (spinId) => {
    try {
      await apiClient.delete(`/spin-wheels/${spinId}`);
      message.success('Đã xóa vòng quay!');
      fetchData();
    } catch (err) {
      console.log(err);
      message.error('Xóa thất bại!');
    }
  };

  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 70,
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: 'Tên vòng quay',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: 'Giá quay',
      dataIndex: 'price',
      align: 'center',
      width: 100,
      render: (p) => <Tag color="green">{p}</Tag>,
    },
    {
      title: 'Tiền tệ',
      dataIndex: 'currency',
      align: 'center',
      width: 100,
      render: (c) => <Tag color="gold">{c}</Tag>,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      render: (t) => new Date(t).toLocaleString(),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      render: (t) => new Date(t).toLocaleString(),
    },
    {
      title: 'Số lượng item',
      dataIndex: 'itemCount',
      align: 'center',
      width: 130,
      render: (count) => <Tag color="blue">{count} items</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      align: 'center',
      width: 120,
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Đang hoạt động' : 'Ngừng'}</Tag>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 140,
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'pointer' }} onClick={() => handleViewDetail(record)} />

          <Popconfirm title="Xóa vòng quay này?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDeleteSpin(record.key)}>
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 16, cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-2 rounded-md">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tên vòng quay..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 260 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a' }}>
            Tìm
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/spin-mana/add')}>
            Thêm mới
          </Button>

          {/* <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}>
            Xuất Excel
          </Button> */}
        </Space.Compact>
      </div>

      <Table
        dataSource={filteredData().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        rowKey="key"
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />

      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">Đã chọn: {selectedRowKeys.length} bản ghi</div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData().length}
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
