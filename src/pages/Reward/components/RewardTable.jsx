import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Image, message, Popconfirm } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api'; // đường dẫn đến api.js của bạn

export default function RewardTable() {
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/items/admin');
      const apiData = res.data.data;
      const mapped = apiData.map((item) => ({
        key: item._id,
        rewardCode: item.itemId,
        rewardName: item.name,
        image: item.image,
        category: item.type,
        quantity: item.customFields?.quantity || 1,
        condition: item.description,
        note: item.notes,
        raw: item,
      }));

      setData(mapped);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải danh sách phần thưởng!');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRewards = () => {
    if (!inputSearchText.trim()) return data;
    return data.filter((item) => item.rewardName.toLowerCase().includes(inputSearchText.toLowerCase()) || item.rewardCode.toLowerCase().includes(inputSearchText.toLowerCase()));
  };

  const handleViewDetail = (record) => {
    navigate(`/item-mana/detail/${record.rewardCode}`);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await apiClient.delete(`/items/admin/${itemId}`);
      message.success('Đã xóa vật phẩm!');
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
      title: 'Mã số',
      dataIndex: 'rewardCode',
      align: 'center',
    },
    {
      title: 'Tên phần thưởng',
      dataIndex: 'rewardName',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      align: 'center',
      render: (src) => <Image src={src} alt="reward" width={50} height={50} style={{ borderRadius: 8, objectFit: 'cover' }} preview={false} />,
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      align: 'center',
      render: (type) => {
        let color = 'blue';
        if (type === 'empty') color = 'gold';
        if (type === 'title') color = 'purple';
        if (type === 'badge') color = 'green';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
      render: (q) => <Tag color="cyan">{q}</Tag>,
    },
    {
      title: 'Điều kiện nhận',
      dataIndex: 'condition',
      ellipsis: true,
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
          <EyeOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'pointer' }} onClick={() => handleViewDetail(record)} />

          <Popconfirm title="Bạn chắc chắn muốn xóa?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDeleteItem(record.rewardCode)}>
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 16, cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-3 rounded-md">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tên hoặc mã phần thưởng..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 260 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a' }}>
            Tìm
          </Button>
          {/* <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1890ff' }} /> */}
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/item-mana/add')}>
            Thêm
          </Button>
          {/* <Button danger icon={<DeleteOutlined />}>
            Xóa
          </Button> */}
          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      <Table
        dataSource={filteredRewards().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
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
          total={filteredRewards().length}
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
