import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Input, Pagination, Select } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import apiClient from '../../../services/api';
import * as XLSX from 'xlsx';
import { showSuccess, showError } from '../../../utils/swalUtils';

export default function StudentTable() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/teacher/students');
        setStudents(res.data.data || []); // backend trả {data: [...]}
      } catch (error) {
        console.error(error);
        showError('Không thể tải danh sách học sinh!');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = students.filter((item) => {
    const t = inputSearchText.toLowerCase().trim();

    const matchText = item.name?.toLowerCase().includes(t) || item.username?.toLowerCase().includes(t);

    const matchGender = !genderFilter || item.gender?.toLowerCase() === genderFilter;

    return matchText && matchGender;
  });

  const handleExport = () => {
    if (filteredStudents.length === 0) {
      showError('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = filteredStudents.map((item, index) => ({
      STT: index + 1,
      'Họ tên': item.name,
      Khối: item.grade,
      Lớp: item.className,
      'Ngày sinh': item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('vi-VN') : '',
      'Giới tính': item.gender,
      'Địa chỉ': item.address,
      'Ghi chú': item.notes,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');

    XLSX.writeFile(workbook, 'Danh_sach_hoc_sinh.xlsx');
    showSuccess('Xuất Excel thành công');
  };

  const columns = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
      width: 70,
      align: 'center',
    },

    {
      title: 'Họ tên',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: 'Khối',
      dataIndex: 'grade',
      align: 'center',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      align: 'center',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      align: 'center',
      render: (dob) => (dob ? new Date(dob).toLocaleDateString('vi-VN') : ''),
    },
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
      title: 'Địa chỉ',
      dataIndex: 'address',
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/student-mana/view/${record.playerId}`)}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="bg-white shadow-lg p-2 ">
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input
            placeholder="Nhập tìm kiếm..."
            value={inputSearchText}
            onChange={(e) => {
              setInputSearchText(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 220 }}
          />

          <Select
            placeholder="Giới tính"
            allowClear
            style={{ width: 120 }}
            value={genderFilter || undefined}
            onChange={(value) => {
              setGenderFilter(value || '');
              setCurrentPage(1);
            }}
            options={[
              { label: 'Nam', value: 'male' },
              { label: 'Nữ', value: 'female' },
            ]}
          />

          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a' }}>
            Tìm
          </Button>
        </Space.Compact>

        <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff' }} onClick={handleExport}>
          Xuất Excel
        </Button>
      </div>

      <Table
        dataSource={filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        loading={loading}
        pagination={false}
        rowKey="_id"
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
          total={filteredStudents.length}
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
