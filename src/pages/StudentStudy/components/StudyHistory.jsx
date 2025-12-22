import React, { useEffect, useState, useMemo } from 'react';
import { Card, Select, Tooltip, Spin } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import apiClient from '../../../services/api';

export default function StudyHistory({ student }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [activity, setActivity] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectData, setSubjectData] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityStats, setActivityStats] = useState({});

  const yearOptions = [2022, 2023, 2024, 2025, 2026].map((y) => ({ value: y, label: y }));
  const COLORS = ['#52c41a', '#d9d9d9'];

  // Fetch subject progress
  const fetchProgress = async () => {
    try {
      const res = await apiClient.get('/progress/subject/my');
      return res.data.data || [];
    } catch (err) {
      console.error('Error fetching progress:', err);
      return [];
    }
  };

  // Fetch activity log
  const fetchActivity = async () => {
    try {
      const res = await apiClient.get('/progress/activity/my?days=365');
      return res.data.data || null;
    } catch (err) {
      console.error('Error fetching activity:', err);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [p1, p2] = await Promise.all([fetchProgress(), fetchActivity()]);

      setProgress(p1);
      setActivity(p2);

      // Process subject data for pie chart
      if (Array.isArray(p1)) {
        const mappedData = {};
        const subjectOptions = [];

        p1.forEach((item) => {
          const subjName = item.subject || 'Unknown';
          const rawPct =
            item.completionPercentage !== undefined && item.completionPercentage !== null
              ? item.completionPercentage
              : (item.totalLessons || 0) + (item.totalExercises || 0) > 0
              ? (((item.completedLessons || 0) + (item.completedExercises || 0)) / ((item.totalLessons || 0) + (item.totalExercises || 0))) * 100
              : 0;

          const pct = Number(rawPct.toFixed(2));

          mappedData[subjName] = {
            completed: pct,
            remaining: 100 - pct,
            raw: item,
          };
          subjectOptions.push({ value: subjName, label: subjName });
        });

        setSubjectData(mappedData);
        setSubjects(subjectOptions);
        if (subjectOptions.length > 0) {
          setSelectedSubject(subjectOptions[0].value);
        }
      }

      // Process activity logs
      if (p2) {
        setActivityLogs(p2.logs || []);
        setActivityStats(p2.statistics || {});
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // --- Pie Data ---
  const currentProgress = selectedSubject && subjectData[selectedSubject] ? subjectData[selectedSubject] : { completed: 0, remaining: 100 };

  const pieData = [
    { name: 'Đã hoàn thành', value: currentProgress.completed },
    { name: 'Chưa hoàn thành', value: currentProgress.remaining },
  ];

  // --- Activity Heatmap Data ---
  const yearData = useMemo(() => {
    const loginMap = {};
    activityLogs.forEach((log) => {
      if (log.date) {
        loginMap[log.date] = true;
      }
    });

    const map = {};
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    const allDays = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      allDays.push(new Date(d));
    }

    for (let month = 0; month < 12; month++) {
      const daysInMonth = allDays.filter((d) => d.getMonth() === month);
      const monthGrid = [];
      let week = Array(7).fill(null);

      daysInMonth.forEach((d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${da}`;
        const dow = d.getDay();

        const dayData = {
          date: dateStr,
          loggedIn: !!loginMap[dateStr],
          dayOfWeek: dow,
        };

        if (week[dow] !== null) {
          monthGrid.push(week);
          week = Array(7).fill(null);
        }

        week[dow] = dayData;
        if (dow === 6) {
          monthGrid.push(week);
          week = Array(7).fill(null);
        }
      });

      if (week.some((v) => v !== null)) monthGrid.push(week);
      map[month] = monthGrid;
    }

    return map;
  }, [activityLogs, selectedYear]);

  const getColor = (loggedIn) => (loggedIn ? '#40c463' : '#ebedf0');
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const translatePeriod = (period) => {
    if (!period) return '365 ngày gần nhất';
    if (period.includes('30 days')) return '30 ngày gần nhất';
    if (period.includes('365 days')) return '365 ngày gần nhất';
    return period;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
      {/* Tiến độ học */}
      <div className="lg:col-span-1">
        <Card title="Tiến độ học tập" className="shadow-sm">
          <div className="flex flex-col items-center">
            {subjects.length > 0 ? (
              <>
                <div className="mb-1 w-full px-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Chọn môn học</label>
                  <Select value={selectedSubject} onChange={setSelectedSubject} options={subjects} className="w-full" size="middle" />
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => {
                        const val = Number(entry.payload.value);
                        // Nếu là số nguyên (ví dụ 100) -> hiển thị 100
                        // Nếu là số lẻ (ví dụ 33.333) -> hiển thị 33.33
                        const displayVal = Number.isInteger(val) ? val : val.toFixed(2);
                        return `${value} (${displayVal}%)`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="text-center ">
                  <div className="text-center ">
                    <div className="text-gray-500">Tiến độ hoàn thành</div>
                    <div className="text-4xl font-bold text-[#23408e]">
                      {/* Logic kiểm tra số nguyên */}
                      {Number.isInteger(currentProgress.completed) ? currentProgress.completed : Number(currentProgress.completed).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-gray-400">Chưa có dữ liệu</div>
            )}
          </div>
        </Card>
      </div>

      {/* Lịch sử hoạt động */}
      <div className="lg:col-span-2">
        <Card
          title="Lịch sử hoạt động"
          className="shadow-sm"
          extra={
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{activityStats.activeDays || 0}</span> ngày hoạt động trong {translatePeriod(activityStats.period)}
              </span>
              <Select value={selectedYear} onChange={setSelectedYear} options={yearOptions} className="w-28" size="small" />
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex mb-3">
                <div className="flex flex-col gap-6">
                  {/* First row of 6 months */}
                  <div className="flex gap-4 justify-start flex-wrap">
                    {Array.from({ length: 6 }).map((_, monthIdx) => {
                      const monthGrid = yearData[monthIdx] || [];
                      return (
                        <div key={monthIdx} className="flex-shrink-0">
                          <div className="text-xs font-semibold text-gray-700 mb-2 text-center">Tháng {monthIdx + 1}</div>
                          <div className="flex gap-1">
                            {monthGrid.length > 0 ? (
                              monthGrid.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-1">
                                  {week.map((d, i) => (
                                    <Tooltip key={i} title={d ? `${d.date}: ${d.loggedIn ? 'Có hoạt động' : 'Không hoạt động'}` : ''}>
                                      <div
                                        className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                                        style={{
                                          backgroundColor: d ? getColor(d.loggedIn) : 'transparent',
                                          opacity: d ? 1 : 0,
                                        }}
                                      />
                                    </Tooltip>
                                  ))}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-400 py-2">Không có dữ liệu</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Second row of 6 months */}
                  <div className="flex gap-4 justify-start flex-wrap">
                    {Array.from({ length: 6 }).map((_, monthIdx) => {
                      const actualMonthIdx = monthIdx + 6;
                      const monthGrid = yearData[actualMonthIdx] || [];
                      return (
                        <div key={actualMonthIdx} className="flex-shrink-0">
                          <div className="text-xs font-semibold text-gray-700 mb-2 text-center">Tháng {actualMonthIdx + 1}</div>
                          <div className="flex gap-1">
                            {monthGrid.length > 0 ? (
                              monthGrid.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-1">
                                  {week.map((d, i) => (
                                    <Tooltip key={i} title={d ? `${d.date}: ${d.loggedIn ? 'Có hoạt động' : 'Không hoạt động'}` : ''}>
                                      <div
                                        className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                                        style={{
                                          backgroundColor: d ? getColor(d.loggedIn) : 'transparent',
                                          opacity: d ? 1 : 0,
                                        }}
                                      />
                                    </Tooltip>
                                  ))}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-400 py-2">Không có dữ liệu</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-1 text-xs text-gray-600 mt-4 pt-3 border-t">
                <span className="font-medium">Không hoạt động</span>
                <div className="w-3 h-3 bg-[#ebedf0] rounded-sm border border-gray-300"></div>
                <div className="flex items-center gap-1">
                  {/* <div className="w-3 h-3 bg-[#9be9a8] rounded-sm"></div> */}
                  <div className="w-3 h-3 bg-[#40c463] rounded-sm"></div>
                  {/* <div className="w-3 h-3 bg-[#30a14e] rounded-sm"></div>
                  <div className="w-3 h-3 bg-[#216e39] rounded-sm"></div> */}
                </div>
                <span className="font-medium">Có hoạt động</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
