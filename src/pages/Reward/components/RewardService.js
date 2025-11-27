// RewardService.js
let rewards = [
  {
    key: '1',
    rewardCode: 'R001',
    rewardName: 'Huy hiệu Vàng',
    image: 'https://cdn-icons-png.flaticon.com/512/2583/2583311.png',
    category: 'Huy hiệu',
    quantity: 10,
    condition: 'Hoàn thành 5 nhiệm vụ liên tiếp',
    note: 'Phần thưởng danh dự cho người chăm chỉ',
  },
  {
    key: '2',
    rewardCode: 'R002',
    rewardName: 'Xu học tập',
    image: 'https://cdn-icons-png.flaticon.com/512/992/992651.png',
    category: 'Tiền tệ',
    quantity: 1000,
    condition: 'Điểm tổng trên 400',
    note: 'Có thể dùng để đổi vật phẩm trong shop',
  },
  {
    key: '3',
    rewardCode: 'R003',
    rewardName: 'Cúp danh dự',
    image: 'https://cdn-icons-png.flaticon.com/512/1821/1821652.png',
    category: 'Danh hiệu',
    quantity: 3,
    condition: 'Đứng top 3 bảng xếp hạng tháng',
    note: 'Cúp vinh danh học sinh xuất sắc',
  },
];

// 🟢 Lấy danh sách reward
export function getRewards() {
  return rewards;
}

// 🟢 Xem chi tiết reward theo key
export function getRewardByKey(key) {
  return rewards.find((r) => r.key === key);
}

// 🟢 Thêm reward mới
export function addReward(newReward) {
  const nextKey = (rewards.length + 1).toString();
  rewards.push({ ...newReward, key: nextKey });
}

// 🟢 Cậps
export function updateReward(key, updatedData) {
  const index = rewards.findIndex((r) => r.key === key);
  if (index !== -1) {
    rewards[index] = { ...rewards[index], ...updatedData };
  }
}

// 🟢 Xóa reward
export function deleteReward(key) {
  rewards = rewards.filter((r) => r.key !== key);
}
