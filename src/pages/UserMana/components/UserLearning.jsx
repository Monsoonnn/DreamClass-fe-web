// UserLearning.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Select, Card, Tooltip, Spin } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { apiClient } from '../../../services/api.js'; // Import apiClient

export default function UserLearning({ user, playerId }) {
  // --- STATE CHO BIỂU ĐỒ TRÒN (NHIỆM VỤ) ---
  // Sử dụng dữ liệu questStats từ API 1 truyền xuống
  const questStats = user.questStats || { finished: 0, total: 0, notStarted: 0 };

  // Tính toán %
  const completedPct = questStats.total > 0 ? Math.round((questStats.finished / questStats.total) * 100) : 0;

  const pieData = [
    { name: 'Đã hoàn thành', value: questStats.finished },
    { name: 'Chưa hoàn thành', value: questStats.total - questStats.finished },
  ];
  const COLORS = ['#52c41a', '#d9d9d9'];

  // --- STATE CHO BIỂU ĐỒ HEATMAP (LỊCH SỬ) ---
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Gọi API lấy lịch sử hoạt động
  useEffect(() => {
    const fetchActivity = async () => {
      if (!playerId) return;
      setLoadingActivity(true);
      try {
        // Lấy 365 ngày gần nhất hoặc theo logic của bạn.
        // Ở đây demo lấy 365 ngày để fill vào lịch
        const response = await apiClient.get(`/progress/activity/${playerId}?days=365`);
        const logs = response.data?.data?.logs || [];
        setActivityLogs(logs);
      } catch (error) {
        console.error('Failed to fetch activity logs', error);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchActivity();
  }, [playerId, selectedYear]); // Nếu API hỗ trợ filter theo năm thì thêm param year vào API

  // Xử lý dữ liệu Heatmap từ logs API
  const yearData = useMemo(() => {
    // Tạo map các ngày đã login: "YYYY-MM-DD" -> true
    const loginMap = {};
    activityLogs.forEach((log) => {
      // Giả sử log có field 'date' hoặc 'loginTime'. API mẫu trả về logs: []
      // Nếu log là object { date: "2025-12-01", ... }
      const dateStr = log.date ? log.date.split('T')[0] : '';
      if (dateStr) loginMap[dateStr] = true;
    });

    // Tạo lưới hiển thị cho năm đã chọn
    const map = {};
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Tạo cấu trúc dữ liệu cho 12 tháng
    const allDays = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      allDays.push(new Date(d));
    }

    for (let month = 0; month < 12; month++) {
      const daysInMonth = allDays.filter((d) => d.getMonth() === month);
      const monthGrid = [];
      let week = Array(7).fill(null);

      daysInMonth.forEach((d) => {
        const dateStr = d.toISOString().split('T')[0];
        const dow = d.getDay(); // 0 (Sun) -> 6 (Sat)

        const dayInfo = {
          date: dateStr,
          loggedIn: !!loginMap[dateStr],
          dayOfWeek: dow,
        };

        if (week[dow] !== null) {
          monthGrid.push(week);
          week = Array(7).fill(null);
        }

        week[dow] = dayInfo;

        // Nếu là thứ 7, push tuần vào grid và reset
        if (dow === 6) {
          monthGrid.push(week);
          week = Array(7).fill(null);
        }
      });

      // Push tuần cuối cùng nếu còn lẻ
      if (week.some((v) => v !== null)) monthGrid.push(week);
      map[month] = monthGrid;
    }
    return map;
  }, [activityLogs, selectedYear]);

  const getColor = (loggedIn) => (loggedIn ? '#40c463' : '#ebedf0');
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const yearOptions = [2024, 2025, 2026].map((y) => ({ value: y, label: y }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
      {/* Cột Trái: Thống kê Nhiệm vụ (Quest Stats) */}
      <div className="lg:col-span-1">
        <Card title="Thống kê Nhiệm vụ" className="shadow-sm">
          <div className="flex flex-col items-center">
            {questStats.total === 0 ? (
              <div className="py-10 text-gray-400">Chưa có dữ liệu nhiệm vụ</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} formatter={(value, entry) => `${value} (${entry.payload.value})`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <div className="text-4xl font-bold text-[#23408e]">{completedPct}%</div>
                  <div className="text-gray-500 mt-1">
                    Hoàn thành ({questStats.finished}/{questStats.total})
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Cột Phải: Lịch sử hoạt động (Heatmap) */}
      <div className="lg:col-span-2">
        <Card
          title="Lịch sử hoạt động (Login)"
          className="shadow-sm"
          extra={
            <div className="flex gap-2 items-center">
              <Select value={selectedYear} onChange={setSelectedYear} options={yearOptions} size="small" className="w-24" />
            </div>
          }
        >
          {loadingActivity ? (
            <div className="flex justify-center p-10">
              <Spin />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="flex mb-2">
                  {/* Nhãn Thứ */}
                  <div className="flex flex-col justify-around mr-2 text-xs text-gray-600 pt-5">
                    {dayLabels.map((day, i) => (
                      <div key={i} className="h-3 leading-3">
                        {i % 2 === 1 ? day : ''}
                      </div>
                    ))}
                  </div>

                  {/* Grid các tháng */}
                  <div className="flex gap-2">
                    {Array.from({ length: 12 }).map((_, monthIdx) => {
                      const monthGrid = yearData[monthIdx];
                      return (
                        <div key={monthIdx}>
                          <div className="text-xs font-semibold text-gray-700 mb-1 text-center">Th{monthIdx + 1}</div>
                          <div className="flex gap-1">
                            {monthGrid.map((week, wIdx) => (
                              <div key={wIdx} className="flex flex-col gap-1">
                                {week.map((d, i) => (
                                  <Tooltip key={i} title={d ? `${d.date}: ${d.loggedIn ? 'Có hoạt động' : 'Không'}` : ''}>
                                    <div className="w-3 h-3 rounded-sm hover:ring-1 hover:ring-gray-400" style={{ backgroundColor: d ? getColor(d.loggedIn) : 'transparent' }} />
                                  </Tooltip>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-xs text-gray-500 mt-2">
                  <span>Ít</span>
                  <div className="w-3 h-3 bg-[#ebedf0] rounded-sm"></div>
                  <div className="w-3 h-3 bg-[#40c463] rounded-sm"></div>
                  <span>Nhiều</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
