import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Select } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/api';
import * as XLSX from 'xlsx';
import { showLoading, closeLoading, showSuccess, showError, showConfirm } from '../../../utils/swalUtils';

const { Option } = Select;

export default function SpinTable() {
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
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
      // showError('Không thể tải danh sách vòng quay!');
      // Optional: uncomment if strict error popup needed on load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = () => {
    let list = data;

    // Filter by Status
    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'active';
      list = list.filter((item) => item.active === isActive);
    }

    // Filter by Search
    if (inputSearchText.trim()) {
      list = list.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()) || item.description.toLowerCase().includes(inputSearchText.toLowerCase()));
    }

    return list;
  };

  const handleViewDetail = (record) => {
    navigate(`/spin-mana/detail/${record.key}`);
  };

  const handleDeleteSpin = (spinId) => {
    showConfirm('Bạn chắc chắn muốn xóa vòng quay này?', async () => {
      showLoading();
      try {
        await apiClient.delete(`/spin-wheels/${spinId}`);
        closeLoading();
        showSuccess('Đã xóa vòng quay!');
        fetchData();
      } catch (err) {
        console.log(err);
        closeLoading();
        showError('Xóa thất bại!');
      }
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) {
      showError('Vui lòng chọn ít nhất một vòng quay để xóa');
      return;
    }

    showConfirm(`Bạn có chắc muốn xóa ${selectedRowKeys.length} vòng quay đã chọn?`, async () => {
      showLoading();
      try {
        await Promise.all(selectedRowKeys.map((key) => apiClient.delete(`/spin-wheels/${key}`)));
        closeLoading();
        showSuccess('Đã xóa các vòng quay đã chọn');
        setSelectedRowKeys([]);
        fetchData();
      } catch (err) {
        console.error(err);
        closeLoading();
        showError('Có lỗi xảy ra khi xóa nhiều vòng quay');
        fetchData(); // Refresh anyway
      }
    });
  };

  const handleExport = () => {
    const listToExport = filteredData();
    if (listToExport.length === 0) {
      showError('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = listToExport.map((item, index) => ({
      STT: index + 1,
      'Tên vòng quay': item.name,
      'Mô tả': item.description,
      'Giá quay': item.price,
      'Tiền tệ': item.currency,
      'Bắt đầu': item.startTime ? new Date(item.startTime).toLocaleString('vi-VN') : '',
      'Kết thúc': item.endTime ? new Date(item.endTime).toLocaleString('vi-VN') : '',
      'Trạng thái': item.active ? 'Đang hoạt động' : 'Ngừng hoạt động',
      'Số lượng Item': item.itemCount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách vòng quay');

    XLSX.writeFile(workbook, 'Danh_sach_vong_quay.xlsx');
    showSuccess('Xuất Excel thành công');
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
      render: (t) => new Date(t).toLocaleString('vi-VN'),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      render: (t) => new Date(t).toLocaleString('vi-VN'),
    },
    {
      title: 'Số phần thưởng',
      dataIndex: 'itemCount',
      align: 'center',
      width: 130,
      render: (count) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      align: 'center',
      width: 120,
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Tag>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 140,
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: '#1890ff', fontSize: 16, cursor: 'pointer' }} onClick={() => handleViewDetail(record)} />
          <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 16, cursor: 'pointer' }} onClick={() => handleDeleteSpin(record.key)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-2 rounded-md">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tên vòng quay..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 200 }} />
          <Select defaultValue="all" style={{ width: 150 }} onChange={setFilterStatus}>
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Đang hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a' }} onClick={() => setCurrentPage(1)}>
            Tìm
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/spin-mana/add')}>
            Thêm
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteMultiple}
            disabled={selectedRowKeys.length === 0} // chỉ enable khi chọn ít nhất 1
            style={{
              opacity: selectedRowKeys.length === 0 ? 0.5 : 1, // mờ khi chưa chọn
              cursor: selectedRowKeys.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Xóa
          </Button>
          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={handleExport}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      <Table
        loading={loading}
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
