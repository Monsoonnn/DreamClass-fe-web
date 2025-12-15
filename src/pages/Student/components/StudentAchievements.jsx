import React, { useEffect, useState } from 'react';
import { Card, Tag } from 'antd';
import { apiClient } from '../../../services/api';

export default function StudentAchievements({ student }) {
  const [itemsDetails, setItemsDetails] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const inventory = student.inventory || [];

  const getAllItems = async () => {
    try {
      const response = await apiClient.get('/items/admin');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching all items:', error);
      return [];
    }
  };

  // Lấy chi tiết vật phẩm theo itemId
  const getItemDetails = (itemId) => {
    const found = allItems.find((item) => item.itemId === itemId);
    return found || null;
  };

  // Fetch danh sách vật phẩm (all items)
  useEffect(() => {
    const fetchItems = async () => {
      const items = await getAllItems();
      setAllItems(items);
    };

    if (allItems.length === 0) fetchItems();
  }, [allItems.length]);

  // Ghép inventory với chi tiết item
  useEffect(() => {
    if (inventory.length > 0 && allItems.length > 0) {
      const merged = inventory.map((item) => {
        const details = getItemDetails(item.itemId);
        return { ...item, details };
      });
      setItemsDetails(merged);
    }
  }, [inventory, allItems]);

  return (
    <Card className="bg-white border-0 w-full max-w-none" styles={{ body: { padding: 0 } }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3">
        {/* LEFT SIDE - Avatar + Info */}
        <div className="md:col-span-1 flex flex-col items-start gap-2">
          <img src={student.avatar || '/avatar-default.png'} alt="avatar" className="w-24 h-24 rounded-full border-2 border-blue-200 object-cover shadow mb-2" />

          <div className="text-xl font-bold text-[#23408e] leading-tight">{student.name}</div>

          {/* <div className="text-sm text-gray-500">Mã số: {student.studentCode}</div> */}

          <Tag
            color={student.role === 'teacher' ? 'blue' : 'green'}
            style={{
              fontWeight: 600,
              fontSize: 12,
              padding: '2px 12px',
              marginTop: 4,
            }}
          >
            {student.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
          </Tag>

          <div className="text-xs text-gray-500 mt-1">Kho đồ: {inventory.length} vật phẩm</div>
        </div>

        {/* RIGHT SIDE - Inventory */}
        <div className="md:col-span-3 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {itemsDetails.length > 0 ? (
              itemsDetails.map((item) => {
                const info = item.details || {};

                return (
                  <div key={item._id} className="p-3 rounded-lg border hover:shadow-md transition bg-white relative text-center">
                    {/* Hình ảnh */}
                    <img src={info.image || 'https://cdn-icons-png.flaticon.com/512/616/616490.png'} alt={info.name} className="w-full h-24 object-contain mx-auto mb-2" />

                    {/* Thông tin */}
                    <div>
                      <div className="font-semibold text-[#23408e] text-sm">{info.name || `Vật phẩm ${item.itemId}`}</div>
                      {/* <div className="text-xs text-gray-500">{info.type || 'Khác'}</div> */}
                      <div className="text-xs text-blue-600 mt-1">Số lượng: {item.quantity}</div>
                    </div>

                    {/* Tag trang bị */}
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
