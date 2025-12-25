// src/pages/user-mana/components/TeacherTable.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Avatar, Select } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
import * as XLSX from 'xlsx';
import TeacherUpdate from './TeacherUpdate';
import { formatDate } from '../../../utils/dateUtil';
import { showLoading, closeLoading, showSuccess, showError, showConfirm } from '../../../utils/swalUtils';

const { Option } = Select;

export default function TeacherTable() {
  const [data, setData] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const navigate = useNavigate();

  // --- Fetch dữ liệu giáo viên từ API ---
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Note: API seems to support pagination.
      // To support client-side filtering properly with small datasets, we might want to fetch all?
      // But let's stick to server pagination if API supports it.
      // However, if we want to filter by Gender client-side, we need all data or API support.
      // Assuming API doesn't support gender filter, let's fetch all for now like UserTable to be safe if dataset is small.
      // But the original code used server pagination.
      // Let's keep server pagination but pass search.
      // If "Missing filter data" means visual filter, I'll implement client side filter on the FETCHED data? No, that's wrong.
      // I'll try to fetch all (limit=1000) to be consistent with UserTable and avoid "incomplete list" issues.

      const response = await apiClient.get('/accounts/teachers', {
        params: {
          page: 1,
          limit: 1000,
          search: inputSearchText || undefined,
        },
      });

      const teachers = response.data?.data || [];
      setData(teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // showError('Không thể tải dữ liệu từ server.'); // Optional silent fail for fetch
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputSearchText]);

  // Client-side filtering wrapper
  const filteredData = () => {
    let list = data;
    if (filterGrade) {
      list = list.filter((t) => t.assignedClasses?.some((c) => c.grade === filterGrade));
    }
    if (filterClass) {
      list = list.filter((t) => t.assignedClasses?.some((c) => c.className === filterClass));
    }
    // Search is already handled by API but we can double check or refined filter
    if (inputSearchText) {
      list = list.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()) || item.username?.toLowerCase().includes(inputSearchText.toLowerCase()));
    }
    return list;
  };

  // --- Delete ---
  const handleDelete = (record) => {
    const id = record.teacherId || record._id || record.key;
    showConfirm('Bạn có chắc muốn xóa giáo viên này?', async () => {
      showLoading();
      try {
        await apiClient.delete(`/accounts/teachers/${id}`);

        // optimistic UI: remove locally first
        setData((prev) => prev.filter((t) => (t.teacherId || t._id || t.key) !== id));
        setSelectedRowKeys([]);

        closeLoading();
        showSuccess('Xóa thành công');

        // fetch fresh list from server to sync
        fetchTeachers();
      } catch (err) {
        console.warn('Delete failed', id, err);
        closeLoading();
        showError('Xóa thất bại');
        // refresh to restore
        fetchTeachers();
      }
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) {
      showError('Vui lòng chọn ít nhất một giáo viên để xóa');
      return;
    }

    showConfirm(`Bạn có chắc muốn xóa ${selectedRowKeys.length} giáo viên đã chọn?`, async () => {
      showLoading();
      try {
        await Promise.all(
          selectedRowKeys.map(async (key) => {
            await apiClient.delete(`/accounts/teachers/${key}`);
          })
        );
        closeLoading();
        showSuccess('Đã xóa các giáo viên đã chọn');
        fetchTeachers();
        setSelectedRowKeys([]);
      } catch (err) {
        console.error('Delete multiple failed', err);
        closeLoading();
        showError('Xóa thất bại một số bản ghi');
        fetchTeachers();
      }
    });
  };

  const handleEdit = (record) => {
    setEditingTeacher(record);
    setEditModalVisible(true);
  };

  const handleExport = () => {
    const listToExport = filteredData();

    if (listToExport.length === 0) {
      showError('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = listToExport.map((item, index) => ({
      STT: index + 1,
      'Họ tên': item.name,
      'Tài khoản': item.username,
      Email: item.email,
      'Giới tính': item.gender === 'Male' ? 'Nam' : item.gender === 'Female' ? 'Nữ' : item.gender,
      'Ngày sinh': formatDate(item.dateOfBirth),
      'Địa chỉ': item.address,
      'Số điện thoại': item.phone,
      'Lớp dạy': item.assignedClasses ? item.assignedClasses.map((c) => c.className).join(', ') : '',
      'Ghi chú': item.notes,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách giáo viên');

    XLSX.writeFile(workbook, 'Danh_sach_giao_vien.xlsx');
    showSuccess('Xuất Excel thành công');
  };

  const renderRole = () => <Tag color="blue">Giáo viên</Tag>;

  const columns = [
    { title: 'STT', key: 'index', align: 'center', render: (_, __, index) => (currentPage - 1) * pageSize + index + 1 },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      render: (avatar) => {
        const safeSrc = avatar && avatar.trim() !== '' ? avatar : '/avatar-default.png';
        return <Avatar src={safeSrc} className="w-10 h-10 rounded-full" />;
      },
    },

    { title: 'Họ tên', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (gender) => {
        if (!gender) return '-';
        const g = gender.toLowerCase();
        if (g === 'male') return 'Nam';
        if (g === 'female') return 'Nữ';
        return gender;
      },
    },

    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      align: 'center',
      render: (date) => formatDate(date),
    },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', align: 'center' },
    { title: 'Tài khoản', dataIndex: 'username', key: 'username', align: 'center' },
    { title: 'Phân loại', key: 'role', align: 'center', render: renderRole },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes', ellipsis: true, align: 'center' },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate(`/user-mana/view-teacher/${record.teacherId || record._id || record.key}`)} />
          <EditOutlined style={{ color: 'blue', cursor: 'pointer' }} onClick={() => handleEdit(record)} />
          <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const paginatedData = filteredData().slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Get unique grades and classes for filter options
  const uniqueGrades = [
    ...new Set(
      data
        .flatMap((item) => item.assignedClasses || [])
        .map((c) => c.grade)
        .filter(Boolean)
    ),
  ].sort();
  const uniqueClasses = [
    ...new Set(
      data
        .flatMap((item) => item.assignedClasses || [])
        .map((c) => c.className)
        .filter(Boolean)
    ),
  ].sort();

  return (
    <div className="bg-white p-3">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 240 }} />
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
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteMultiple} disabled={selectedRowKeys.length === 0}>
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
          rowKey={(record) => record.teacherId || record._id || record.key}
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
          total={filteredData().length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
        />
      </div>

      <TeacherUpdate open={editModalVisible} onClose={() => setEditModalVisible(false)} teacherData={editingTeacher} onUpdated={fetchTeachers} />
    </div>
  );
}
