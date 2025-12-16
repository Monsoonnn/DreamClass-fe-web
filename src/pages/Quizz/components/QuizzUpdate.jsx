import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Select, Form, Tag, Breadcrumb, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../../services/api';
import { showLoading, closeLoading, showSuccess, showError } from '../../../utils/swalUtils';

export default function QuizzUpdate() {
  const navigate = useNavigate();
  const { quizzId } = useParams(); // ⬅ lấy ID từ URL
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [chapterName, setChapterName] = useState(''); // backend yêu cầu chapters = [{}]

  /* --------------------------------------------------
   * 1️⃣ LOAD QUIZZ DETAIL
   * -------------------------------------------------- */
  const fetchDetail = async () => {
    try {
      const res = await apiClient.get(`/quizzes/${quizzId}`);
      const data = res.data.data;

      form.setFieldsValue({
        name: data.name,
        subject: data.subject,
        grade: data.grade,
      });

      // API structure:
      // chapters[0].questions[]
      setChapterName(data.chapters?.[0]?.name || '');

      setQuestions(
        data.chapters?.[0]?.questions?.map((q) => ({
          questionText: q.questionText,
          answers: [
            { text: q.options.A, isCorrect: q.correctAnswer === 'A' },
            { text: q.options.B, isCorrect: q.correctAnswer === 'B' },
            { text: q.options.C, isCorrect: q.correctAnswer === 'C' },
            { text: q.options.D, isCorrect: q.correctAnswer === 'D' },
          ],
        })) || []
      );

      setLoading(false);
    } catch (err) {
      console.error(err);
      showError('Không thể tải thông tin quizz');
      navigate('/quizz-mana');
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  /* --------------------------------------------------
   * 2️⃣ FUNCTIONS: Add/Delete/Change Question
   * -------------------------------------------------- */
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQ = [...questions];
    newQ.splice(index, 1);
    setQuestions(newQ);
  };

  const handleChangeQuestion = (index, value) => {
    const newQ = [...questions];
    newQ[index].questionText = value;
    setQuestions(newQ);
  };

  const handleChangeAnswer = (qIndex, aIndex, value) => {
    const newQ = [...questions];
    newQ[qIndex].answers[aIndex].text = value;
    setQuestions(newQ);
  };

  const handleCorrectAnswer = (qIndex, aIndex) => {
    const newQ = [...questions];
    newQ[qIndex].answers = newQ[qIndex].answers.map((a, idx) => ({
      ...a,
      isCorrect: idx === aIndex,
    }));
    setQuestions(newQ);
  };

  /* --------------------------------------------------
   * 3️⃣ SUBMIT UPDATE
   * -------------------------------------------------- */
  const handleSubmit = async (values) => {
    // Validate that each question has at least one correct answer
    for (const q of questions) {
      if (!q.answers.some(a => a.isCorrect)) {
        showError('Mỗi câu hỏi phải có ít nhất một đáp án đúng được chọn!');
        return;
      }
    }

    const body = {
      name: values.name,
      subject: values.subject,
      grade: values.grade,
      chapters: [
        {
          name: chapterName,
          questions: questions.map((q) => ({
            questionText: q.questionText,
            options: {
              A: q.answers[0].text,
              B: q.answers[1].text,
              C: q.answers[2].text,
              D: q.answers[3].text,
            },
            correctAnswer: ['A', 'B', 'C', 'D'][q.answers.findIndex((a) => a.isCorrect)],
          })),
        },
      ],
    };

    setSubmitLoading(true); // Start button loading
    try {
      await apiClient.put(`/quizzes/${quizzId}`, body);
      await showSuccess('Cập nhật quizz thành công!');
      navigate('/quizz-mana');
    } catch (err) {
      console.error(err);
      showError('Lỗi khi cập nhật quizz!');
    } finally {
      setSubmitLoading(false); // End button loading
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  /* --------------------------------------------------
   * 4️⃣ UI
   * -------------------------------------------------- */
  return (
    <div>
      {/* BREADCRUMB */}
      <div className="p-2">
        <Breadcrumb
          className="mb-4 text-sm"
          items={[
            {
              href: '/quizz-mana',
              title: (
                <>
                  <UserOutlined />
                  <span>Quản lý quizz</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <UnorderedListOutlined />
                  <span className="font-semibold text-[#23408e]">Chỉnh sửa quizz</span>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="mx-auto p-3 bg-white rounded-none shadow">
        <h2 className="text-xl font-semibold">Chỉnh sửa quizz</h2>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="custom-form">
          <Form.Item label="Tên quizz" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Môn học" name="subject" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'Toán Học', label: 'Toán Học' },
                { value: 'Vật Lý', label: 'Vật Lý' },
                { value: 'Hoá Học', label: 'Hoá Học' },
                { value: 'Sinh Học', label: 'Sinh Học' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Khối lớp" name="grade" rules={[{ required: true }]}>
            <Select
              options={[
                { value: '10', label: '10' },
                { value: '11', label: '11' },
                { value: '12', label: '12' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Tên chương">
            <Input value={chapterName} onChange={(e) => setChapterName(e.target.value)} />
          </Form.Item>

          <h3 className="text-lg font-semibold mb-1">Danh sách câu hỏi</h3>

          {questions.map((q, qIndex) => (
            <Card
              key={qIndex}
              className="border border-gray-300 rounded-none"
              title={
                <div className="flex justify-between">
                  <span>
                    Câu {qIndex + 1} {q.answers.some((a) => a.isCorrect) ? <Tag color="green">Đã chọn đáp án đúng</Tag> : <Tag color="red">Chưa chọn đáp án</Tag>}
                  </span>

                  <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteQuestion(qIndex)} />
                </div>
              }
            >
              <Form.Item label="Nội dung câu hỏi" required>
                <Input value={q.questionText} onChange={(e) => handleChangeQuestion(qIndex, e.target.value)} />
              </Form.Item>

              {q.answers.map((a, aIndex) => (
                <Form.Item key={aIndex}>
                  <div className="flex items-center gap-1">
                    <Input value={a.text} placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`} onChange={(e) => handleChangeAnswer(qIndex, aIndex, e.target.value)} />

                    <Button type={a.isCorrect ? 'primary' : 'default'} onClick={() => handleCorrectAnswer(qIndex, aIndex)}>
                      Đúng
                    </Button>
                  </div>
                </Form.Item>
              ))}
            </Card>
          ))}

          <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddQuestion} className="mt-1 rounded-none">
            Thêm câu hỏi
          </Button>

          <div className="mt-2 flex justify-end gap-1">
            <Button onClick={() => navigate('/quizz-mana')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
