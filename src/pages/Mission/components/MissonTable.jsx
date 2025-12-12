import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Pagination, Select } from 'antd';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getMissions } from './MissionService';
import EditMissionModal from './EditMissionModal';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';
import * as XLSX from 'xlsx';
import { showLoading, closeLoading, showSuccess, showError, showConfirm } from '../../../utils/swalUtils';

const { Option } = Select;

export default function MissionTable() {
  const [missions, setMissions] = useState([]);
  const [inputSearchText, setInputSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    setLoading(true);
    try {
      console.log('Fetching quest templates...');
      const res = await apiClient.get('/quests/admin/templates');
      const questsData = res.data?.data || [];
      setMissions(questsData);
    } catch (err) {
      console.error('Error fetching quests:', err.response?.status, err.message);
      // Fallback to mock data if API fails
      setMissions(getMissions());
    } finally {
      setLoading(false);
    }
  };

  const filteredMissions = () => {
    let list = missions;

    if (filterType !== 'all') {
      list = list.filter((m) => m.dailyQuestType === filterType);
    }

    if (inputSearchText.trim()) {
      list = list.filter((item) => item.name.toLowerCase().includes(inputSearchText.toLowerCase()) || item.questId.toLowerCase().includes(inputSearchText.toLowerCase()));
    }
    return list;
  };

  const handleExport = () => {
    const listToExport = filteredMissions();
    if (listToExport.length === 0) {
      showError('Không có dữ liệu để xuất Excel');
      return;
    }

    const exportData = listToExport.map((item, index) => ({
      STT: index + 1,
      'Mã nhiệm vụ': item.questId,
      'Tên nhiệm vụ': item.name,
      'Ngày tạo': item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—',
      'Loại quest': item.dailyQuestType,
      Vàng: item.rewardGold,
      'Điểm thưởng': item.point,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách nhiệm vụ');

    XLSX.writeFile(workbook, 'Danh_sach_nhiem_vu.xlsx');
    showSuccess('Xuất Excel thành công');
  };

  const handleDelete = (record) => {
    showConfirm('Bạn có chắc muốn xoá nhiệm vụ này?', async () => {
      showLoading();
      try {
        await apiClient.delete(`/quests/admin/templates/${record.questId}`);

        // Update local state
        const newMissions = missions.filter((m) => m.questId !== record.questId);
        setMissions(newMissions);
        setSelectedRowKeys((keys) => keys.filter((k) => k !== record.questId));

        const totalPages = Math.ceil(newMissions.length / pageSize);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages > 0 ? totalPages : 1);
        }

        closeLoading();
        showSuccess('Xóa nhiệm vụ thành công!');
      } catch (err) {
        console.error('Xóa thất bại:', err);
        closeLoading();
        showError('Xóa nhiệm vụ thất bại!');
      }
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) {
      showError('Vui lòng chọn ít nhất một nhiệm vụ để xóa');
      return;
    }

    showConfirm(`Bạn có chắc muốn xóa ${selectedRowKeys.length} nhiệm vụ đã chọn?`, async () => {
      showLoading();
      try {
        await Promise.all(selectedRowKeys.map((id) => apiClient.delete(`/quests/admin/templates/${id}`)));
        closeLoading();
        showSuccess('Đã xóa các nhiệm vụ đã chọn');
        fetchQuests();
        setSelectedRowKeys([]);
      } catch (err) {
        console.error(err);
        closeLoading();
        showError('Có lỗi xảy ra khi xóa nhiều nhiệm vụ');
        fetchQuests();
      }
    });
  };

  const refreshMissions = () => {
    fetchQuests();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const columns = [
    { title: 'STT', render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize, width: 70, align: 'center' },
    { title: 'Mã nhiệm vụ', dataIndex: 'questId', align: 'center' },
    { title: 'Tên nhiệm vụ', dataIndex: 'name' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', align: 'center', render: (createdAt) => formatDate(createdAt) },
    {
      title: 'Loại',
      dataIndex: 'isDailyQuest',
      align: 'center',
      render: (isDailyQuest) => <Tag color={isDailyQuest ? 'green' : 'gold'}>{isDailyQuest ? 'Hàng ngày' : 'Thông thường'}</Tag>,
    },

    {
      title: 'Cách nhận',
      dataIndex: 'dailyQuestType',
      align: 'center',
      render: (type) => {
        if (!type) return '—';
        switch (type) {
          case 'NPC_INTERACTION':
            return 'Tương tác NPC';
          case 'AUTO_ASSIGN':
            return 'Tự động';
          default:
            return type; // fallback nếu API trả về loại khác
        }
      },
    },
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
          <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg p-2">
      <>
        <div className="flex justify-between items-center flex-wrap mb-3 gap-2">
          <Space.Compact className="w-full max-w-xl">
            <Input placeholder="Nhập tìm kiếm..." value={inputSearchText} onChange={(e) => setInputSearchText(e.target.value)} style={{ width: 200 }} />
            <Select defaultValue="all" style={{ width: 160 }} onChange={setFilterType}>
              <Option value="all">Cách nhận</Option>
              <Option value="NPC_INTERACTION">Tương tác NPC</Option>
              <Option value="AUTO_ASSIGN">Tự động</Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => setCurrentPage(1)}>
              Tìm
            </Button>
          </Space.Compact>

          <Space.Compact>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/mission-mana/add')}>
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
          dataSource={filteredMissions().slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          columns={columns}
          pagination={false}
          rowKey="questId"
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
            total={filteredMissions().length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>

        {editModalVisible && currentMission && (
          <EditMissionModal
            visible={editModalVisible}
            onClose={() => setEditModalVisible(false)}
            missionData={{ ...currentMission, allMissions: missions }}
            refreshMissions={refreshMissions}
          />
        )}
      </>
    </div>
  );
}
