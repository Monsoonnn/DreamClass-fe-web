import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Breadcrumb, Spin, message, Descriptions, Tag, Space } from 'antd';
import { ReadOutlined, UnorderedListOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import TeacherMissionEdit from './TeacherMissionEdit';
import { apiClient } from '../../../services/api';

export default function TeacherMissionDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [allMissions, setAllMissions] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questId) {
      fetchMissionDetail();
    }
  }, [questId]);

  const fetchMissionDetail = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/teacher/quest-templates/${questId}`); // Assuming teacher can access their quest detail
      const missionData = res.data?.data || null;
      if (!missionData) {
        message.error('Không tìm thấy nhiệm vụ');
        setTimeout(() => navigate('/teacher-mission-mana'), 1200);
        return;
      }
      setMission(missionData);
      fetchAllMissions(); // Fetch all missions for prerequisite selection in edit modal
    } catch (err) {
      console.error('Error fetching mission detail:', err.response?.status, err.message);
      message.error('Lỗi khi tải thông tin nhiệm vụ');
      setTimeout(() => navigate('/teacher-mission-mana'), 1200);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMissions = async () => {
    try {
      const res = await apiClient.get('/quests/admin/templates'); // Fetch all quest templates
      const allData = res.data?.data || [];
      setAllMissions(allData);
    } catch (err) {
      console.warn('Could not fetch all missions for prerequisite selection:', err.message);
    }
  };

  const refreshMission = () => {
    fetchMissionDetail();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!mission) return <div className="p-6">Không tìm thấy nhiệm vụ</div>;

  return (
    <div className="p-2">
      <Breadcrumb
        className="mb-4 text-sm"
        items={[
          {
            href: '/teacher-mission-mana',
            title: (
              <>
                <ReadOutlined />
                <span>Quản lý nhiệm vụ</span>
              </>
            ),
          },
          {
            title: (
              <>
                <UnorderedListOutlined />
                <span className="font-semibold text-[#23408e]">Thông tin nhiệm vụ</span>
              </>
            ),
          },
        ]}
      />
      
      <div className="bg-gray-200 p-2 rounded-md flex justify-center">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Chi tiết nhiệm vụ: {mission.name}</h2>
          
          <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }} contentStyle={{ width: '100%' }}>
            <Descriptions.Item label="Mã nhiệm vụ">{mission.questId}</Descriptions.Item>
            <Descriptions.Item label="Tên nhiệm vụ">{mission.name}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{mission.description}</Descriptions.Item>
            <Descriptions.Item label="Cách nhận quest">{mission.dailyQuestType}</Descriptions.Item>
            <Descriptions.Item label="Điều kiện tiên quyết">
              {mission.prerequisiteQuestIds?.length > 0 ? (
                mission.prerequisiteQuestIds.map(id => <Tag key={id}>{id}</Tag>)
              ) : (
                'Không'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Vàng">{mission.rewardGold}</Descriptions.Item>
            <Descriptions.Item label="Điểm thưởng">{mission.point}</Descriptions.Item>
            <Descriptions.Item label="Là nhiệm vụ hàng ngày?">
              {mission.isDailyQuest ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{formatDate(mission.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">{formatDate(mission.updatedAt)}</Descriptions.Item>
          </Descriptions>

          <Space direction="vertical" className="w-full mt-4">
            <h3 className="text-lg font-semibold mt-4 mb-2">Các bước thực hiện</h3>
            {mission.steps?.length > 0 ? (
              mission.steps.map((step, index) => (
                <Card key={step.stepId} size="small" title={`Bước ${index + 1}: ${step.stepId}`}>
                  <p><strong>Mô tả:</strong> {step.description}</p>
                </Card>
              ))
            ) : (
              <p>Không có bước thực hiện nào.</p>
            )}
          </Space>

          <div className="flex gap-3 mt-6">
            <Button type="primary" icon={<EditOutlined />} style={{ backgroundColor: '#1677ff' }} onClick={() => setEditModalVisible(true)}>
              Chỉnh sửa
            </Button>
            <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate('/teacher-mission-mana')}>
              Quay lại
            </Button>
          </div>
        </div>
      </div>

      {/* --- Edit Mission Modal --- */}
      {editModalVisible && (
        <TeacherMissionEdit visible={editModalVisible} onClose={() => setEditModalVisible(false)} missionData={{ ...mission, allMissions }} refreshMissions={refreshMission} />
      )}
    </div>
  );
}