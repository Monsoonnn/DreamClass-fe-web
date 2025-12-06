import React, { useState } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Avatar, message } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

export default function StoreTable() {
  // 🧩 DỮ LIỆU MẪU VẬT PHẨM CỬA HÀNG
  const data = [
    {
      key: '1',
      code: 'ITEM001',
      name: 'Bút Chì Siêu Cấp',
      image: '/images/item_pencil.jpg',
      category: 'Dụng cụ học tập',
      quantity: 120,
      price: 30,
      note: 'Bút chì cho học sinh',
    },
    {
      key: '2',
      code: 'ITEM002',
      name: 'Vở Ô Li Xịn',
      image: '/images/item_notebook.jpg',
      category: 'Dụng cụ học tập',
      quantity: 85,
      price: 50,
      note: 'Vở 200 trang',
    },
    {
      key: '3',
      code: 'ITEM003',
      name: 'Sticker Ngộ Nghĩnh',
      image: '/images/item_sticker.jpg',
      category: 'Phụ kiện',
      quantity: 300,
      price: 15,
      note: 'Sticker phần thưởng',
    },
  ];

  // STATE
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 🔍 Lọc dữ liệu theo tên, mã vật phẩm
  const filteredList = () => {
    if (!searchText.trim()) return data;

    return data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.code.toLowerCase().includes(searchText.toLowerCase()));
  };

  const handleExport = () => {
    const listToExport = filteredList();
    if (listToExport.length === 0) {
      message.warning('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = listToExport.map((item, index) => ({
      'STT': index + 1,
      'Mã vật phẩm': item.code,
      'Tên vật phẩm': item.name,
      'Phân loại': item.category,
      'Số lượng': item.quantity,
      'Giá (Points)': item.price,
      'Ghi chú': item.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách vật phẩm');

    XLSX.writeFile(workbook, 'Danh_sach_vat_pham.xlsx');
    message.success('Xuất Excel thành công');
  };

  // 🟦 Thao tác
  const handleViewDetail = (record) => {
    console.log('Xem vật phẩm:', record);
  };

  // 🟩 Render phân loại
  const renderCategory = (category) => {
    return <Tag color="blue">{category}</Tag>;
  };

  // 🧱 CÁC CỘT BẢNG
  const columns = [
    {
      title: 'STT',
      align: 'center',
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mã vật phẩm',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      align: 'center',
      width: 90,
      render: (image) => <Avatar src={image} shape="square" size={50} />,
    },
    {
      title: 'Tên vật phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      align: 'center',
      render: (category) => renderCategory(category),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'Giá (Points)',
      dataIndex: 'price',
      align: 'center',
      render: (price) => <b>{price} pts</b>,
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
          <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-3">
      {/* THANH CÔNG CỤ */}
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Tìm theo tên hoặc mã vật phẩm..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 260 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Tìm
          </Button>
          <Button type="primary" icon={<FilterOutlined />} />
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm mới
          </Button>

          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff' }} onClick={handleExport}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      {/* BẢNG */}
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

      {/* PHÂN TRANG + THỐNG KÊ */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">Đã chọn: {selectedRowKeys.length} vật phẩm</div>

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
