import dayjs from 'dayjs';

/**
 * Chuẩn hóa format ngày tháng hiển thị cho toàn bộ dự án
 * Format chuẩn: DD/MM/YYYY
 * @param {string|Date} date - Ngày cần format
 * @returns {string} - Chuỗi ngày đã format hoặc '--' nếu null/undefined
 */
export const formatDate = (date) => {
  if (!date) return '--';
  return dayjs(date).format('DD/MM/YYYY');
};

/**
 * Format ngày tháng cho Input/DatePicker
 * @param {string|Date} date 
 * @returns {dayjs.Dayjs} object dayjs
 */
export const parseDate = (date) => {
  return date ? dayjs(date) : null;
};
