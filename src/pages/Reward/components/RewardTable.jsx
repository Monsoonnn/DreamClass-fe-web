import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Image, Select } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api';
import * as XLSX from 'xlsx';
import RewardEditModal from './RewardEditModal';
import { showLoading, closeLoading, showSuccess, showError, showConfirm } from '../../../utils/swalUtils';

const { Option } = Select;

export default function RewardTable() {
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/items/admin');
      const apiData = res.data.data;
      const mapped = apiData.map((item) => ({
        key: item._id, // Internal ID
        rewardCode: item.itemId, // The business ID
        rewardName: item.name,
        image: item.image,
        category: item.type,
        quantity: item.customFields?.quantity || item.quantity || 1, // Fallback
        condition: item.description,
        note: item.notes,
        raw: item,
      }));

      setData(mapped);
    } catch (err) {
      console.error(err);
      // showError('Không thể tải danh sách phần thưởng!');
      // Optional: uncomment if you want loud errors on fetch
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRewards = () => {
    let list = data;

    // Filter by Category
    if (filterCategory !== 'all') {
      list = list.filter((item) => item.category === filterCategory);
    }

    // Filter by Search
    if (inputSearchText.trim()) {
      list = list.filter((item) => item.rewardName.toLowerCase().includes(inputSearchText.toLowerCase()) || item.rewardCode.toLowerCase().includes(inputSearchText.toLowerCase()));
    }
    return list;
  };

  const handleExport = () => {
    const listToExport = filteredRewards();
    if (listToExport.length === 0) {
      showError('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = listToExport.map((item, index) => ({
      STT: index + 1,
      'Mã số': item.rewardCode,
      'Tên phần thưởng': item.rewardName,
      'Phân loại': item.category === 'banner' ? 'Cờ hiệu' : item.category === 'title' ? 'Danh hiệu' : item.category === 'badge' ? 'Huy hiệu' : 'Khác',
      'Số lượng': item.quantity,
      'Mô tả': item.condition,
      'Ghi chú': item.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách phần thưởng');

    XLSX.writeFile(workbook, 'Danh_sach_phan_thuong.xlsx');
    showSuccess('Xuất Excel thành công');
  };

  const handleViewDetail = (record) => {
    navigate(`/item-mana/detail/${record.rewardCode}`);
  };

  const handleDeleteItem = (itemId) => {
    showConfirm('Bạn chắc chắn muốn xóa vật phẩm này?', async () => {
      showLoading();
      try {
        await apiClient.delete(`/items/admin/${itemId}`);
        closeLoading();
        showSuccess('Đã xóa vật phẩm!');
        fetchData();
      } catch (err) {
        console.log(err);
        closeLoading();
        showError('Xóa thất bại!');
      }
    });
  };
  const handleDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) return;

    showConfirm(`Bạn chắc chắn muốn xóa ${selectedRowKeys.length} vật phẩm đã chọn?`, async () => {
      showLoading();
      try {
        await Promise.all(selectedRowKeys.map((itemId) => apiClient.delete(`/items/admin/${itemId}`)));

        closeLoading();
        showSuccess('Đã xóa các vật phẩm đã chọn!');
        setSelectedRowKeys([]);
        fetchData();
      } catch (err) {
        console.error(err);
        closeLoading();
        showError('Xóa nhiều thất bại!');
      }
    });
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setEditModalVisible(true);
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
        let text = type;
        if (type === 'empty') {
          color = 'gold';
          text = 'Khác';
        }
        if (type === 'title') {
          color = 'purple';
          text = 'Danh hiệu';
        }
        if (type === 'badge') {
          color = 'green';
          text = 'Huy hiệu';
        }
        if (type === 'banner') {
          color = 'cyan';
          text = 'Cờ hiệu';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
      render: (q) => <Tag color="cyan">{q}</Tag>,
    },
    {
      title: 'Mô tả',
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
          <EditOutlined style={{ color: 'blue', fontSize: 16, cursor: 'pointer' }} onClick={() => handleEdit(record)} />
          <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 16, cursor: 'pointer' }} onClick={() => handleDeleteItem(record.rewardCode)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-3 rounded-md">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tên hoặc mã phần thưởng..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 200 }} />
          <Select defaultValue="all" style={{ width: 150 }} onChange={setFilterCategory}>
            <Option value="all">Tất cả phân loại</Option>
            <Option value="banner">Cờ hiệu</Option>
            <Option value="title">Danh hiệu</Option>
            {/* <Option value="badge">Huy hiệu</Option> */}
            <Option value="empty">Khác</Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a' }} onClick={() => setCurrentPage(1)}>
            Tìm
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/item-mana/add')}>
            Thêm
          </Button>
          <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={handleDeleteMultiple}>
            Xóa
          </Button>

          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={handleExport}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      <Table
        dataSource={filteredRewards().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        rowKey="rewardCode"
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
        loading={loading}
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

      <RewardEditModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} reward={editingItem} onUpdate={fetchData} />
    </div>
  );
}
