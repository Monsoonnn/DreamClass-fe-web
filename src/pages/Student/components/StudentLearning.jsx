import React, { useState, useMemo } from 'react';
import { Select, Card, Tooltip } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function StudentLearning({ student }) {
  const [selectedSubject, setSelectedSubject] = useState('Toán học');
  const [selectedYear, setSelectedYear] = useState(2024);

  const subjects = [
    { value: 'Toán học', label: 'Toán học' },
    { value: 'Vật lý', label: 'Vật lý' },
    { value: 'Hóa học', label: 'Hóa học' },
    { value: 'Tiếng Anh', label: 'Tiếng Anh' },
  ];

  const yearOptions = [2022, 2023, 2024, 2025].map((y) => ({ value: y, label: y }));

  const progressData = {
    'Toán học': { completed: 75, remaining: 25 },
    'Vật lý': { completed: 60, remaining: 40 },
    'Hóa học': { completed: 45, remaining: 55 },
    'Tiếng Anh': { completed: 80, remaining: 20 },
  };

  const currentProgress = progressData[selectedSubject];
  const pieData = [
    { name: 'Đã hoàn thành', value: currentProgress.completed },
    { name: 'Chưa hoàn thành', value: currentProgress.remaining },
  ];

  const COLORS = ['#52c41a', '#d9d9d9'];

  // =============================
  // Tạo dữ liệu đăng nhập
  // =============================
  const generateActivityData = (year) => {
    const data = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      const randomLogins = Math.floor(Math.random() * 6); // demo: 0-5 lần đăng nhập
      data.push({
        date: day.toISOString().split('T')[0],
        count: randomLogins,
        dayOfWeek: day.getDay(),
        month: day.getMonth(),
      });
    }
    return data;
  };

  const activityData = useMemo(() => generateActivityData(selectedYear), [selectedYear]);

  // =============================
  // Group data theo tháng
  // =============================
  const months = useMemo(() => {
    const map = {};

    for (let month = 0; month < 12; month++) {
      const daysInMonth = activityData.filter((d) => d.month === month);
      const monthGrid = [];
      let week = Array(7).fill(null);

      daysInMonth.forEach((d) => {
        const dow = d.dayOfWeek;

        if (week[dow] !== null) {
          monthGrid.push(week);
          week = Array(7).fill(null);
        }

        week[dow] = d;
        if (dow === 6) {
          monthGrid.push(week);
          week = Array(7).fill(null);
        }
      });

      if (week.some((v) => v !== null)) monthGrid.push(week);

      map[month] = monthGrid;
    }

    return map;
  }, [activityData]);

  const getColor = (count) => {
    if (count === 0) return '#ebedf0';
    if (count === 1) return '#9be9a8';
    if (count === 2) return '#40c463';
    if (count === 3) return '#30a14e';
    return '#216e39';
  };

  const totalLogins = activityData.reduce((sum, d) => sum + d.count, 0);
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
      {/* Tiến độ học */}
      <div className="lg:col-span-1">
        <Card title="Tiến độ học tập" className="shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Chọn môn học</label>
            <Select value={selectedSubject} onChange={setSelectedSubject} options={subjects} className="w-full" size="middle" />
          </div>

          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} formatter={(value, entry) => `${value}: ${entry.payload.value}%`} />
              </PieChart>
            </ResponsiveContainer>

            <div className="text-center mt-4">
              <div className="text-4xl font-bold text-[#23408e]">{currentProgress.completed}%</div>
              <div className="text-gray-500 mt-1">Tiến độ hoàn thành</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lịch sử đăng nhập */}
      <div className="lg:col-span-2">
        <Card
          title="Lịch sử đăng nhập"
          className="shadow-sm"
          extra={
            <span className="text-sm text-gray-500">
              {totalLogins} lần trong năm {selectedYear}
            </span>
          }
        >
          {/* Chọn năm */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn năm</label>
            <Select value={selectedYear} onChange={setSelectedYear} options={yearOptions} className="w-32" />
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Nhãn thứ */}
              <div className="flex mb-2">
                <div className="flex flex-col justify-around mr-2 text-xs text-gray-600">
                  {dayLabels.map((day, i) => (
                    <div key={i} className="h-3 leading-3">
                      {i % 2 === 1 ? day : ''}
                    </div>
                  ))}
                </div>

                {/* Grid từng tháng */}
                <div className="flex gap-2">
                  {Array.from({ length: 12 }).map((_, monthIdx) => {
                    const monthGrid = months[monthIdx];
                    return (
                      <div key={monthIdx}>
                        <div className="text-xs font-semibold text-gray-700 mb-1 text-center">Th{monthIdx + 1}</div>
                        <div className="flex gap-1">
                          {monthGrid.map((week, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-1">
                              {week.map((d, i) => (
                                <Tooltip key={i} title={d ? `${d.date}: ${d.count} lần đăng nhập` : 'Không có dữ liệu'}>
                                  <div
                                    className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-gray-300 cursor-pointer"
                                    style={{ backgroundColor: d ? getColor(d.count) : '#ebedf0' }}
                                  />
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

              <div className="flex items-center justify-end mt-4 gap-2 text-xs text-gray-600">
                <span>Ít</span>
                {[0, 1, 2, 3, 4].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(c) }} />
                ))}
                <span>Nhiều</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
