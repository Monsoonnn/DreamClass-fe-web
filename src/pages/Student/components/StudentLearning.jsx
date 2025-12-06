import React, { useState, useEffect, useMemo } from 'react';
import { Select, Card, Tooltip, Spin, message } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { apiClient } from '../../../services/api';

export default function StudentLearning({ student, playerId }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectData, setSubjectData] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityStats, setActivityStats] = useState({});
  const [loadingActivity, setLoadingActivity] = useState(false);

  const yearOptions = [2022, 2023, 2024, 2025, 2026].map((y) => ({ value: y, label: y }));
  const COLORS = ['#52c41a', '#d9d9d9'];

  // --- 1. Fetch Subject Progress ---
  useEffect(() => {
    const fetchProgress = async () => {
      if (!playerId) return;
      setLoadingProgress(true);
      try {
        const res = await apiClient.get(`/progress/subject/${playerId}`);
        const data = res.data?.data || [];
        
        const mappedData = {};
        const subjectOptions = [];

        if (Array.isArray(data)) {
          data.forEach((item) => {
            const subjName = item.subject || 'Unknown';
            
            const pct = item.completionPercentage !== undefined && item.completionPercentage !== null
              ? item.completionPercentage
              : (item.totalLessons || 0) + (item.totalExercises || 0) > 0
                ? Math.round(((item.completedLessons || 0) + (item.completedExercises || 0)) / ((item.totalLessons || 0) + (item.totalExercises || 0)) * 100)
                : 0;

            mappedData[subjName] = { 
              completed: pct, 
              remaining: 100 - pct,
              raw: item 
            };
            subjectOptions.push({ value: subjName, label: subjName });
          });
        }

        setSubjectData(mappedData);
        setSubjects(subjectOptions);
        
        if (subjectOptions.length > 0 && !selectedSubject) {
          setSelectedSubject(subjectOptions[0].value);
        }
      } catch (err) {
        console.error('Fetch subject progress failed', err);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [playerId]);

  // --- 2. Fetch Activity Log ---
  useEffect(() => {
    const fetchActivity = async () => {
      if (!playerId) return;
      setLoadingActivity(true);
      try {
        const res = await apiClient.get(`/progress/activity/${playerId}?days=365`);
        const { logs, statistics } = res.data?.data || { logs: [], statistics: {} };
        setActivityLogs(logs || []);
        setActivityStats(statistics || {});
      } catch (err) {
        console.error('Fetch activity failed', err);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchActivity();
  }, [playerId, selectedYear]);

  // --- Pie Data ---
  const currentProgress = selectedSubject && subjectData[selectedSubject] 
    ? subjectData[selectedSubject] 
    : { completed: 0, remaining: 100 };

  const pieData = [
    { name: 'Đã hoàn thành', value: currentProgress.completed },
    { name: 'Chưa hoàn thành', value: currentProgress.remaining },
  ];

  // --- Activity Heatmap Data ---
  const yearData = useMemo(() => {
    const loginMap = {};
    // Use raw date string "YYYY-MM-DD" from API to avoid timezone issues
    activityLogs.forEach(log => {
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
        // Manually format date to YYYY-MM-DD to match API
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

  // Helper to translate period strings
  const translatePeriod = (period) => {
    if (!period) return '30 ngày gần nhất';
    if (period.includes('30 days')) return '30 ngày gần nhất';
    if (period.includes('365 days')) return '365 ngày gần nhất';
    return period;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Tiến độ học */}
      <div className="lg:col-span-1">
        <Card title="Tiến độ học tập" className="shadow-sm" loading={loadingProgress}>
          <div className="flex flex-col items-center">
            {subjects.length > 0 ? (
              <>
                <div className="mb-4 w-full px-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Chọn môn học</label>
                  <Select 
                    value={selectedSubject} 
                    onChange={setSelectedSubject} 
                    options={subjects} 
                    className="w-full" 
                    size="middle" 
                  />
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} formatter={(value, entry) => `${value} (${entry.payload.value}%)`} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="text-center mt-4">
                  <div className="text-4xl font-bold text-[#23408e]">{currentProgress.completed}%</div>
                  <div className="text-gray-500 mt-1">Tiến độ hoàn thành</div>
                </div>
              </>
            ) : (
              <div className="py-10 text-gray-400">Chưa có dữ liệu môn học</div>
            )}
          </div>
        </Card>
      </div>

      {/* Lịch sử hoạt động */}
      <div className="lg:col-span-2">
        <Card
          title="Lịch sử hoạt động"
          className="shadow-sm"
          loading={loadingActivity}
          extra={
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{activityStats.activeDays || 0}</span> ngày hoạt động trong {translatePeriod(activityStats.period)}
              </span>
              <Select value={selectedYear} onChange={setSelectedYear} options={yearOptions} className="w-28" size='small'/>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex mb-3">
                <div className="flex flex-col justify-around mr-3 text-xs text-gray-600 pt-6">
                  {dayLabels.map((day, i) => (
                    <div key={i} className="h-3 leading-3 text-right" style={{ minWidth: '20px' }}>
                      {i % 2 === 1 ? day : ''}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  {/* First row of 6 months */}
                  <div className="flex gap-4 justify-start flex-wrap">
                    {Array.from({ length: 6 }).map((_, monthIdx) => {
                      const monthGrid = yearData[monthIdx] || [];
                      return (
                        <div key={monthIdx} className="flex-shrink-0">
                          <div className="text-xs font-semibold text-gray-700 mb-2 text-center">
                            Tháng {monthIdx + 1}
                          </div>
                          <div className="flex gap-1">
                            {monthGrid.length > 0 ? (
                              monthGrid.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-1">
                                  {week.map((d, i) => (
                                    <Tooltip 
                                      key={i} 
                                      title={d ? `${d.date}: ${d.loggedIn ? 'Có hoạt động' : 'Không hoạt động'}` : ''}
                                    >
                                      <div
                                        className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                                        style={{ 
                                          backgroundColor: d ? getColor(d.loggedIn) : 'transparent',
                                          opacity: d ? 1 : 0
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
                          <div className="text-xs font-semibold text-gray-700 mb-2 text-center">
                            Tháng {actualMonthIdx + 1}
                          </div>
                          <div className="flex gap-1">
                            {monthGrid.length > 0 ? (
                              monthGrid.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-1">
                                  {week.map((d, i) => (
                                    <Tooltip 
                                      key={i} 
                                      title={d ? `${d.date}: ${d.loggedIn ? 'Có hoạt động' : 'Không hoạt động'}` : ''}
                                    >
                                      <div
                                        className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                                        style={{ 
                                          backgroundColor: d ? getColor(d.loggedIn) : 'transparent',
                                          opacity: d ? 1 : 0
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

              <div className="flex justify-end items-center gap-3 text-xs text-gray-600 mt-4 pt-3 border-t">
                <span className="font-medium">Không hoạt động</span>
                <div className="w-3 h-3 bg-[#ebedf0] rounded-sm border border-gray-300"></div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#9be9a8] rounded-sm"></div>
                  <div className="w-3 h-3 bg-[#40c463] rounded-sm"></div>
                  <div className="w-3 h-3 bg-[#30a14e] rounded-sm"></div>
                  <div className="w-3 h-3 bg-[#216e39] rounded-sm"></div>
                </div>
                <span className="font-medium">Nhiều hoạt động</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}