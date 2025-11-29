// MissionService.js

const STORAGE_KEY = 'missions_data';

// Mock data ban đầu
const initialData = [
  {
    questId: 'Q001',
    name: 'Làm quen với Mai',
    description: 'Mai là cô bạn thân thiện ngồi ở bàn đầu...',
    rewardGold: 100,
    point: 50,
    prerequisiteQuestIds: [],
    steps: [{ stepId: 'S001', description: 'Nói chuyện với Mai' }],
    isActive: false,
    isDailyQuest: false,
    dailyQuestType: 'NPC_INTERACTION',
    createdAt: '2025-11-18T18:33:08.395Z',
    updatedAt: '2025-11-21T10:13:25.510Z',
  },
  {
    questId: 'Q101',
    name: 'Thực hành: Nhiệt lượng riêng của nước',
    description: 'Tiến hành đo nhiệt lượng để xác định nhiệt dung riêng...',
    rewardGold: 80,
    point: 50,
    prerequisiteQuestIds: [],
    steps: [
      { stepId: 'S101', description: 'Lấy nước và đo khối lượng ban đầu...' },
      { stepId: 'S102', description: 'Bật nguồn điện và oát kế' },
      { stepId: 'S103', description: 'Ghi lại nhiệt độ nước sau mỗi 5 giây' },
    ],
    isActive: true,
    isDailyQuest: true,
    dailyQuestType: 'NPC_INTERACTION',
    createdAt: '2025-11-18T18:37:15.530Z',
    updatedAt: '2025-11-18T19:31:14.298Z',
  },
];

// --- Internal: Load / Save localStorage ---
function loadMissions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialData;
}

function saveMissions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Public APIs ---
export function getMissions() {
  return loadMissions();
}

export function addMission(mission) {
  const list = loadMissions();
  list.push(mission);
  saveMissions(list);
}

export function updateMission(questId, updatedData) {
  const list = loadMissions();
  const index = list.findIndex((item) => item.questId === questId);
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedData, updatedAt: new Date().toISOString() };
    saveMissions(list);
  }
}

export function deleteMission(questId) {
  const list = loadMissions().filter((item) => item.questId !== questId);
  saveMissions(list);
}
