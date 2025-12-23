import apiClient from './api';

export const historyService = {
  // Lấy lịch sử Quiz
  getQuizHistory: async (playerId, page = 1, limit = 10, isMyHistory = false) => {
    const url = isMyHistory ? '/quizzes/history/my' : `/quizzes/history/student/${playerId}`;
    const response = await apiClient.get(url, {
      params: { page, limit },
    });
    return response.data;
  },

  // Lấy lịch sử Nhiệm vụ
  getQuestHistory: async (playerId, page = 1, limit = 10, isMyHistory = false) => {
    const url = isMyHistory ? '/quests/history/my' : `/quests/history/student/${playerId}`;
    const response = await apiClient.get(url, {
      params: { page, limit },
    });
    return response.data;
  },
};