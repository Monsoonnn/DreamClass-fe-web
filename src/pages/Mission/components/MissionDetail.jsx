import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMissions } from './MissionService';
import { Button, Breadcrumb, Spin, message } from 'antd';
import { SolutionOutlined, InfoCircleOutlined } from '@ant-design/icons';
import EditMissionModal from './EditMissionModal';
import { apiClient } from '../../../services/api';

export default function MissionDetail() {
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
      console.log('Fetching mission detail for questId:', questId);
      const res = await apiClient.get(`/quests/admin/templates/${questId}`);
      console.log('Mission detail response:', res.data);

      const missionData = res.data?.data || null;
      if (!missionData) {
        message.error('Không tìm thấy nhiệm vụ');
        setTimeout(() => navigate('/mission-mana'), 1200);
        return;
      }

      setMission(missionData);

      // Fetch all missions for prerequisite selection
      fetchAllMissions();
    } catch (err) {
      console.error('Error fetching mission detail:', err.response?.status, err.message);
      if (err.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/login'), 800);
      } else {
        message.error('Lỗi khi tải thông tin nhiệm vụ');
        setTimeout(() => navigate('/mission-mana'), 1200);
      }
      // Fallback to mock data
      const data = getMissions();
      const found = data.find((item) => item.questId === questId);
      setMission(found);
      setAllMissions(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMissions = async () => {
    try {
      const res = await apiClient.get('/quests/admin/templates');
      const allData = res.data?.data || [];
      setAllMissions(allData);
    } catch (err) {
      console.warn('Could not fetch all missions for prerequisite selection:', err.message);
      // Fallback
      setAllMissions(getMissions());
    }
  };

  const refreshMission = () => {
    fetchMissionDetail();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN');
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
            href: '/mission-mana',
            title: (
              <>
                <SolutionOutlined />
                <span>Quản lý nhiệm vụ</span>
              </>
            ),
          },
          {
            title: (
              <>
                <InfoCircleOutlined />
                <span className="font-semibold text-[#23408e]">Thông tin nhiệm vụ</span>
              </>
            ),
          },
        ]}
      />
      <div className=" p-2 rounded-md flex justify-center">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-4xl">
          <h3 className="text-lg font-semibold mb-4">Thông tin Nhiệm vụ</h3>
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
              <strong>Điều kiện tiên quyết:</strong> {mission.prerequisiteQuestIds.length > 0 ? mission.prerequisiteQuestIds.join(', ') : 'Không'}
            </p>

            <p>
              <strong>Vàng:</strong> {mission.rewardGold}
            </p>
            <p>
              <strong>Điểm thưởng:</strong> {mission.point}
            </p>
            <p>
              <strong>Có phải quest hàng ngày không:</strong> {mission.isDailyQuest || mission.isDaily ? 'Có' : 'Không'}
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
          {mission.steps?.map((step, index) => (
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
          ))}

          <div className="flex gap-2 mt-6">
            <Button type="primary" style={{ backgroundColor: '#1677ff' }} onClick={() => setEditModalVisible(true)}>
              Chỉnh sửa
            </Button>

            <Button danger onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </div>
        </div>
      </div>

      {/* --- Edit Mission Modal --- */}
      {editModalVisible && (
        <EditMissionModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} missionData={{ ...mission, allMissions }} refreshMissions={refreshMission} />
      )}
    </div>
  );
}
