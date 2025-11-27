import React, { useState } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Image } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getRewards, getRewardByKey, addReward, updateReward, deleteReward } from './RewardService';
import { useNavigate } from 'react-router-dom';

export default function RewardTable() {
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState(getRewards());
  const navigate = useNavigate();
  const filteredRewards = () => {
    if (!inputSearchText.trim()) return data;
    return data.filter((item) => item.rewardName.toLowerCase().includes(inputSearchText.toLowerCase()) || item.rewardCode.toLowerCase().includes(inputSearchText.toLowerCase()));
  };

  const handleViewDetail = (record) => {
    // Chuyển tới trang detail theo key của reward
    navigate(`/reward-mana/detail/${record.key}`);
  };

  const handleDelete = (key) => {
    deleteReward(key);
    setData(getRewards()); // cập nhật lại data sau khi xóa
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      width: 70,
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: 'Mã số',
      dataIndex: 'rewardCode',
      key: 'rewardCode',
      align: 'center',
    },
    {
      title: 'Tên phần thưởng',
      dataIndex: 'rewardName',
      key: 'rewardName',
      align: 'left',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      render: (src) => <Image src={src} alt="reward" width={50} height={50} style={{ borderRadius: 8, objectFit: 'cover' }} preview={false} />,
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      render: (category) => {
        let color = 'blue';
        if (category === 'Tiền tệ') color = 'gold';
        else if (category === 'Danh hiệu') color = 'purple';
        else if (category === 'Huy hiệu') color = 'green';
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity) => <Tag color="cyan">{quantity}</Tag>,
    },
    {
      title: 'Điều kiện nhận',
      dataIndex: 'condition',
      key: 'condition',
      align: 'left',
      ellipsis: true,
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
          <EyeOutlined style={{ color: '#1890ff', fontSize: '16px', cursor: 'pointer' }} onClick={() => handleViewDetail(record)} />
          <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '16px', cursor: 'pointer' }} onClick={() => handleDelete(record.key)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-3 rounded-md">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tên hoặc mã phần thưởng..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 260 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Tìm
          </Button>
          <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1890ff' }} />
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/reward-mana/add')}>
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
        <div className="text-sm text-gray-800">
          <span>Đã chọn: {selectedRowKeys.length} bản ghi</span>
        </div>
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
