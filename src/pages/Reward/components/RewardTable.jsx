import React, { useState } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Image } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';

export default function RewardTable() {
  const data = [
    {
      key: '1',
      rewardCode: 'R001',
      rewardName: 'Huy hiệu Vàng',
      image: 'https://cdn-icons-png.flaticon.com/512/2583/2583311.png',
      category: 'Huy hiệu',
      quantity: 10,
      condition: 'Hoàn thành 5 nhiệm vụ liên tiếp',
      note: 'Phần thưởng danh dự cho người chăm chỉ',
    },
    {
      key: '2',
      rewardCode: 'R002',
      rewardName: 'Xu học tập',
      image: 'https://cdn-icons-png.flaticon.com/512/992/992651.png',
      category: 'Tiền tệ',
      quantity: 1000,
      condition: 'Điểm tổng trên 400',
      note: 'Có thể dùng để đổi vật phẩm trong shop',
    },
    {
      key: '3',
      rewardCode: 'R003',
      rewardName: 'Cúp danh dự',
      image: 'https://cdn-icons-png.flaticon.com/512/1821/1821652.png',
      category: 'Danh hiệu',
      quantity: 3,
      condition: 'Đứng top 3 bảng xếp hạng tháng',
      note: 'Cúp vinh danh học sinh xuất sắc',
    },
  ];

  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredRewards = () => {
    if (!inputSearchText.trim()) return data;
    return data.filter((item) => item.rewardName.toLowerCase().includes(inputSearchText.toLowerCase()) || item.rewardCode.toLowerCase().includes(inputSearchText.toLowerCase()));
  };

  const handleViewDetail = (reward) => {
    console.log('Chi tiết phần thưởng:', reward);
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
          <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            Xem
          </Button>
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

        <Button
          type="default"
          icon={<FileExcelOutlined />}
          style={{
            backgroundColor: '#52c41a',
            color: '#fff',
            borderColor: '#52c41a',
          }}
        >
          Xuất Excel
        </Button>
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
