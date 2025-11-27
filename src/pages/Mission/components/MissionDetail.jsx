import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMissions } from './MissionService';
import { Button, Breadcrumb } from 'antd';
import { ReadOutlined, UnorderedListOutlined } from '@ant-design/icons';
import EditMissionModal from './EditMissionModal'; // import modal

export default function MissionDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [allMissions, setAllMissions] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    const data = getMissions();
    const found = data.find((item) => item.questId === questId);
    setMission(found);
    setAllMissions(data); // lưu tất cả nhiệm vụ để chọn prerequisite
  }, [questId]);

  const refreshMission = () => {
    const data = getMissions();
    const updated = data.find((item) => item.questId === questId);
    setMission(updated);
    setAllMissions(data);
  };

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
              <strong>Loại quest:</strong> {mission.dailyQuestType}
            </p>
            <p>
              <strong>Điều kiện:</strong> {mission.prerequisiteQuestIds.length > 0 ? mission.prerequisiteQuestIds.join(', ') : 'Không'}
            </p>
            <p>
              <strong>Trạng thái:</strong> {mission.isActive ? 'Bật' : 'Tắt'}
            </p>
            <p>
              <strong>Điểm thưởng:</strong> {mission.rewardGold}
            </p>
            <p>
              <strong>Daily Type:</strong> {mission.isDailyQuest ? 'True' : 'False'}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {mission.createdAt?.slice(0, 10)}
            </p>
            <p>
              <strong>Ngày cập nhật:</strong> {mission.updatedAt?.slice(0, 10)}
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

          <div className="flex gap-3 mt-6">
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
