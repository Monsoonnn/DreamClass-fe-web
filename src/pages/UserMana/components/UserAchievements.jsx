import React from 'react';
import { Card, Tag } from 'antd';
import { getRewards } from '../../Reward/components/RewardService';

export default function UserAchievements({ user }) {
  // Lấy tất cả phần thưởng (hiện tại không lọc theo học sinh)
  const rewards = getRewards();

  return (
    <Card
      className="bg-white border-0 w-full max-w-none"
      styles={{
        body: { padding: 0 },
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3">
        {/* LEFT SIDE - Avatar + Info */}
        <div className="md:col-span-1 flex flex-col items-start gap-2">
          <img src={user.avatar || '/avatar-default.png'} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-200 object-cover shadow mb-2" />

          <div className="text-xl font-bold text-[#23408e] leading-tight">{user.name}</div>

          <div className="text-sm text-gray-500">Mã số: {user.userCode}</div>

          <Tag
            color={user.role === 'teacher' ? 'blue' : 'green'}
            style={{
              fontWeight: 600,
              fontSize: 12,
              padding: '2px 12px',
              marginTop: 4,
            }}
          >
            {user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
          </Tag>
        </div>

        {/* RIGHT SIDE - Rewards Display */}
        <div className="md:col-span-3 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rewards.map((reward) => (
              <div key={reward.key} className="flex items-center gap-3 p-2 rounded-lg border hover:shadow-md transition bg-white">
                <img src={reward.image} alt={reward.rewardName} className="w-14 h-14 object-cover rounded-md border" />
                <div>
                  <div className="font-semibold text-[#23408e]">{reward.rewardName}</div>
                  <div className="text-xs text-gray-500">{reward.category}</div>
                </div>
              </div>
            ))}

            {rewards.length === 0 && <div className="text-gray-500 text-sm">Chưa có phần thưởng nào.</div>}
          </div>
        </div>
      </div>
    </Card>
  );
}
