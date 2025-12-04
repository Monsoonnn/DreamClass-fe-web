import React, { useEffect, useState } from 'react';
import { Card, Tag } from 'antd';
import { apiClient } from '../../../services/api'; // Đảm bảo import apiClient đúng

export default function UserAchievements({ user }) {
  const [itemsDetails, setItemsDetails] = useState([]);
  const [allItems, setAllItems] = useState([]); // Lưu trữ danh sách tất cả vật phẩm từ API
  const inventory = user.inventory || [];

  // Hàm lấy danh sách tất cả vật phẩm từ API
  const getAllItems = async () => {
    try {
      const response = await apiClient.get('/items/admin');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching all items:', error);
      return [];
    }
  };

  // Hàm kết hợp vật phẩm từ inventory với chi tiết từ danh sách vật phẩm
  const getItemDetails = (itemId) => {
    const item = allItems.find((item) => item.itemId === itemId);
    return item || null;
  };

  useEffect(() => {
    const fetchAllItems = async () => {
      const items = await getAllItems();
      setAllItems(items); // Lưu danh sách tất cả vật phẩm vào state
    };

    if (allItems.length === 0) {
      fetchAllItems();
    }
  }, [allItems.length]);

  useEffect(() => {
    const fetchItemDetails = () => {
      const itemsWithDetails = inventory.map((item) => {
        const details = getItemDetails(item.itemId); // Lấy thông tin vật phẩm từ danh sách allItems
        return { ...item, details };
      });
      setItemsDetails(itemsWithDetails);
    };

    if (inventory.length > 0 && allItems.length > 0) {
      fetchItemDetails();
    }
  }, [inventory, allItems]);

  return (
    <Card className="bg-white border-0 w-full max-w-none" style={{ body: { padding: 0 } }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3">
        {/* LEFT SIDE - Avatar + Info Compact */}
        <div className="md:col-span-1 flex flex-col items-start gap-2 border-r pr-2">
          <div className="flex items-center gap-3">
            <img src={user.avatar || '/avatar-default.png'} alt="avatar" className="w-16 h-16 rounded-full border object-cover" />
            <div>
              <div className="font-bold text-[#23408e]">{user.name}</div>
              <div className="text-xs text-gray-500">Kho đồ: {inventory.length} vật phẩm</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Inventory Display */}
        <div className="md:col-span-3 w-full pl-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {itemsDetails.length > 0 ? (
              itemsDetails.map((item) => {
                const info = item.details || {}; // Lấy thông tin chi tiết vật phẩm
                return (
                  <div key={item._id} className="flex items-center gap-3 p-2 rounded-lg border hover:shadow-md transition bg-white relative">
                    <img src={info.image || 'https://cdn-icons-png.flaticon.com/512/616/616490.png'} alt={info.name} className="w-12 h-12 object-contain" />
                    <div>
                      <div className="font-semibold text-[#23408e] text-sm">{info.name || `Vật phẩm ${item.itemId}`}</div>
                      <div className="text-xs text-gray-500">{info.type || 'Khác'}</div>
                      <div className="text-xs text-blue-600">Số lượng: {item.quantity}</div>
                    </div>
                    {item.isEquipped && (
                      <Tag color="gold" className="absolute top-1 right-1 text-[10px] mr-0">
                        Đang trang bị
                      </Tag>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">Học sinh chưa có vật phẩm nào trong kho.</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
