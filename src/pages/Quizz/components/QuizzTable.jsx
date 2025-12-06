import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Input, Pagination, message, Tag, Select, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, FileExcelOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
import * as XLSX from 'xlsx';

const { Option } = Select;

export default function QuizzTable() {
  const [loading, setLoading] = useState(false);
  const [quizzList, setQuizzList] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');

  const navigate = useNavigate();

  // ================= GET API =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/quizzes'); // Fetch all quizzes for client-side filtering
      const quizzes = res.data?.data || [];

      const mapped = quizzes.map((q) => ({
        id: q._id,
        name: q.name,
        subject: q.subject,
        grade: q.grade,
        chapter: q.chapters?.map((c) => c.name).join(', ') || 'Không có',
        note: `Số chương: ${q.chapters?.length || 0}`,
      }));

      setQuizzList(mapped);
    } catch (error) {
      message.error('Lỗi tải danh sách quizz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = () => {
    let list = quizzList;

    if (filterSubject !== 'all') {
      list = list.filter(item => item.subject === filterSubject);
    }

    if (filterGrade !== 'all') {
      list = list.filter(item => String(item.grade) === String(filterGrade));
    }

    if (inputSearchText.trim()) {
      list = list.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()));
    }
    return list;
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/quizzes/${id}`);
      message.success('Xóa quizz thành công!');
      fetchData(); // Refresh data
      setSelectedRowKeys([]);
    } catch (err) {
      console.error(err);
      message.error('Xóa quizz thất bại!');
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một quizz để xóa');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} quizz đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map(id => apiClient.delete(`/quizzes/${id}`))
          );
          message.success('Đã xóa các quizz đã chọn');
          fetchData();
          setSelectedRowKeys([]);
        } catch (err) {
          console.error(err);
          message.error('Có lỗi xảy ra khi xóa nhiều quizz');
          fetchData();
        }
      },
    });
  };

  const handleExport = () => {
    const dataToExport = filteredData();
    if (dataToExport.length === 0) {
      message.warning('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = dataToExport.map((item, index) => ({
      'STT': index + 1,
      'Tên quizz': item.name,
      'Khối': item.grade,
      'Môn học': item.subject,
      'Chương': item.chapter,
      'Ghi chú': item.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách quizz');

    XLSX.writeFile(workbook, 'Danh_sach_quizz.xlsx');
    message.success('Xuất Excel thành công');
  };

  const columns = [
    {
      title: 'STT',
      width: 60,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên quizz',
      dataIndex: 'name',
      className: 'font-medium',
    },
    {
      title: 'Khối',
      dataIndex: 'grade',
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Chương',
      dataIndex: 'chapter',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
    {
      title: 'Thao tác',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate(`/quizz-mana/view/${record.id}`)} />
          <EditOutlined style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate(`/quizz-mana/update/${record.id}`)} />
          <Popconfirm title="Bạn chắc chắn muốn xóa?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record.id)}>
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uniqueSubjects = [...new Set(quizzList.map(item => item.subject).filter(Boolean))];
  const uniqueGrades = [...new Set(quizzList.map(item => item.grade).filter(Boolean))];

  // ================= RENDER =================
  return (
    <div className="p-2 bg-white shadow">
      {/* ======= Search + Add + Export ======= */}
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 150 }} />
          <Select 
            defaultValue="all" 
            style={{ width: 120 }} 
            onChange={setFilterSubject}
          >
            <Option value="all">Tất cả môn</Option>
            {uniqueSubjects.map(sub => <Option key={sub} value={sub}>{sub}</Option>)}
          </Select>
          <Select 
            defaultValue="all" 
            style={{ width: 120 }} 
            onChange={setFilterGrade}
          >
            <Option value="all">Tất cả khối</Option>
            {uniqueGrades.map(grade => <Option key={grade} value={grade}>{grade}</Option>)}
          </Select>
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Tìm
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/quizz-mana/add`)}>
            Thêm
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteMultiple}>
            Xóa
          </Button>
          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }} onClick={handleExport}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      {/* ========= TABLE ========= */}
      <Table
        loading={loading}
        dataSource={filteredData().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        rowKey="id"
        bordered
        size="small"
        scroll={{ x: 'max-content' }}
        pagination={false}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
      />

      {/* ======= Pagination + Count ======= */}
      <div className="flex justify-between items-center mt-3 flex-wrap gap-1">
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