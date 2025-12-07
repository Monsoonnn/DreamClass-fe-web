import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Breadcrumb, Spin, message } from 'antd'; // Bỏ Descriptions, Tag, Card, Space vì không dùng nữa
import { ReadOutlined, UnorderedListOutlined } from '@ant-design/icons';
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
      // Assuming teacher can access their quest detail
      const res = await apiClient.get(`/quests/admin/templates/${questId}`);
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
      <h2 className="text-xl font-semibold mb-4">Thông tin nhiệm vụ</h2>

      <div className="bg-gray-200 p-2 rounded-md flex justify-center">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-3xl">
          <h3 className="text-lg font-semibold mb-4">Thông tin quest</h3>

          {/* Layout Grid giống MissionDetail.jsx */}
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <p>
              <strong>Mã nhiệm vụ:</strong> {mission.questId}
            </p>
            <p>
              <strong>Tên nhiệm vụ:</strong> {mission.name}
            </p>
            <p>
              <strong>Mô tả:</strong> {mission.description}
            </p>
            <p>
              <strong>Cách nhận quest:</strong> {mission.dailyQuestType}
            </p>
            <p>
              <strong>Điều kiện tiên quyết:</strong> {mission.prerequisiteQuestIds?.length > 0 ? mission.prerequisiteQuestIds.join(', ') : 'Không'}
            </p>

            <p>
              <strong>Vàng:</strong> {mission.rewardGold}
            </p>
            <p>
              <strong>Điểm thưởng:</strong> {mission.point}
            </p>
            <p>
              <strong>Có phải quest hàng ngày không:</strong> {mission.isDailyQuest ? 'Có' : 'Không'}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {formatDate(mission.createdAt)}
            </p>
            <p>
              <strong>Ngày cập nhật:</strong> {formatDate(mission.updatedAt)}
            </p>
          </div>

          <hr className="my-5" />

          <h3 className="text-lg font-semibold mb-2">Các bước thực hiện</h3>
          {mission.steps?.length > 0 ? (
            mission.steps.map((step, index) => (
              <div key={step.stepId} className="mb-3 text-sm">
                <p>
                  <strong>{index + 1}.</strong>
                </p>
                <p>
                  <strong>StepID:</strong> {step.stepId}
                </p>
                <p>
                  <strong>Mô tả:</strong> {step.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm">Không có bước thực hiện nào.</p>
          )}

          <div className="flex gap-3 mt-6">
            <Button type="primary" style={{ backgroundColor: '#1677ff' }} onClick={() => setEditModalVisible(true)}>
              Chỉnh sửa
            </Button>

            <Button danger onClick={() => navigate('/teacher-mission-mana')}>
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
