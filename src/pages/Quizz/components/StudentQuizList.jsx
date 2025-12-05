import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../services/api';

export default function StudentQuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/quizzes');
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Không tải được danh sách quiz!');
    } finally {
      setLoading(false);
    }
  };

  const filtered = quizzes.filter((q) => {
    const bySubject = subjectFilter ? q.subject === subjectFilter : true;
    const bySearch = searchText ? q.name.toLowerCase().includes(searchText.toLowerCase()) : true;
    return bySubject && bySearch;
  });

  const getTotalQuestions = (quiz) => quiz.chapters?.reduce((sum, ch) => sum + ch.questions.length, 0) || 0;

  return (
    <div className="min-h-screen bg-blue-50  md:p-10 font-sans text-slate-800">
      <div className=" ">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-1">
          <div>
            <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight">Danh sách quizz</h1>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white max-w-xl p-2 rounded-xl shadow-sm border border-gray-100 mb-2 flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* Search Icon SVG */}
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm bài thi..."
              className="pl-10 block w-full border-gray-200 rounded-lg bg-gray-50 text-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 transition-all"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              className="block w-full border-gray-200 rounded-lg bg-gray-50 text-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 cursor-pointer"
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">Tất cả môn học</option>
              {[...new Set(quizzes.map((q) => q.subject))].map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg font-medium text-gray-500">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Grid Content */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Không tìm thấy bài thi nào phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Decorative Top Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{quiz.subject}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Khối {quiz.grade}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{quiz.name}</h3>

                      <div className="mt-auto pt-4 flex items-center text-gray-500 text-sm">
                        {/* Question Icon */}
                        <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {getTotalQuestions(quiz)} câu hỏi
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <button
                        onClick={() => window.open(`/student-quizz-detail/${quiz._id}`, '_blank')}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5"
                      >
                        <span>Làm bài ngay</span>
                        <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
