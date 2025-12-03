import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Input, Pagination, message, Tag } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, FileExcelOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';

export default function QuizzTable() {
  const [loading, setLoading] = useState(false);
  const [quizzList, setQuizzList] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  // ================= GET API =================
  const fetchData = async (subject, grade) => {
    setLoading(true);
    try {
      const res = await apiClient.get('/quizzes', {
        params: {
          ...(subject ? { subject } : {}),
          ...(grade ? { grade } : {}),
        },
      });

      const quizzes = res.data?.data || [];

      const mapped = quizzes.map((q) => ({
        id: q._id,
        name: q.name,
        subject: q.subject,
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

  // ================= FILTER =================
  const filteredData = quizzList.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()));

  // ================= DELETE LOCAL =================
  const handleDelete = (id) => {
    setQuizzList(quizzList.filter((item) => item.id !== id));
    message.success('Xóa thành công');
  };

  // ================= TABLE COLUMNS =================
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

          <Popconfirm title="Bạn chắc chắn muốn xóa?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record.id)}>
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <div className="p-2 bg-white shadow">
      {/* ======= Search + Add + Export ======= */}
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 220 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Tìm
          </Button>
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/quizz-mana/add`)}>
            Thêm
          </Button>
          <Button type="default" icon={<FileExcelOutlined />} style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}>
            Xuất Excel
          </Button>
        </Space.Compact>
      </div>

      {/* ========= TABLE ========= */}
      <Table
        loading={loading}
        dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
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
          total={filteredData.length}
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
