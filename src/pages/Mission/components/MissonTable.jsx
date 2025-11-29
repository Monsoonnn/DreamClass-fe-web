import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Popconfirm } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, FilterOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getMissions, deleteMission } from './MissionService';
import EditMissionModal from './EditMissionModal';
import { useNavigate } from 'react-router-dom';

export default function MissionTable() {
  const [missions, setMissions] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setMissions(getMissions());
  }, []);

  const filteredMissions = () => {
    if (!inputSearchText.trim()) return missions;
    return missions.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()) || item.questId.toLowerCase().includes(inputSearchText.toLowerCase()));
  };

  const handleDelete = (record) => {
    deleteMission(record.questId);
    setMissions(getMissions());
    setSelectedRowKeys([]);
  };

  const refreshMissions = () => {
    setMissions(getMissions());
  };

  const columns = [
    { title: 'STT', render: (_, __, index) => index + 1, width: 70, align: 'center' },
    { title: 'Mã nhiệm vụ', dataIndex: 'questId', align: 'center' },
    { title: 'Tên nhiệm vụ', dataIndex: 'name' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', align: 'center' },
    { title: 'Loại quest', dataIndex: 'dailyQuestType', align: 'center' },
    { title: 'Vàng', dataIndex: 'rewardGold', align: 'center', render: (rewardGold) => <Tag color="gold">{rewardGold}</Tag> },
    { title: 'Điểm thưởng', dataIndex: 'point', align: 'center', render: (point) => <Tag color="blue">{point}</Tag> },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate(`/mission-mana/view/${record.questId}`)} />
          <EditOutlined
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => {
              setCurrentMission(record);
              setEditModalVisible(true);
            }}
          />
          <Popconfirm title="Bạn có chắc muốn xoá?" onConfirm={() => handleDelete(record)} okText="Xóa" cancelText="Hủy">
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-2">
      {/* Thanh công cụ */}
      <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
        <Space.Compact className="w-full max-w-xl">
          <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 220 }} />
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
            Tìm
          </Button>
          <Button type="primary" icon={<FilterOutlined />} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} />
        </Space.Compact>

        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/mission-mana/add')}>
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

      {/* Bảng dữ liệu */}
      <Table
        dataSource={filteredMissions().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        rowKey="questId"
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />

      {/* Phân trang & Thông tin chọn */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2 m-2">
        <div className="text-sm text-gray-800">
          <span>Đã chọn: {selectedRowKeys.length} bản ghi</span>
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredMissions().length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
        />
      </div>

      {/* --- Edit Mission Modal --- */}
      {editModalVisible && currentMission && (
        <EditMissionModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          missionData={{ ...currentMission, allMissions: missions }}
          refreshMissions={refreshMissions}
        />
      )}
    </div>
  );
}
