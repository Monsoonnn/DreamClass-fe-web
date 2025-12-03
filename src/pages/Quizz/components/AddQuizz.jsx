import React, { useState } from 'react';
import { Button, Card, Input, Select, Space, Form, message, Tag, Breadcrumb } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../services/api';

export default function AddQuizz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([
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

  /** ========================
   *  GHÉP API Ở ĐÂY
   * ======================== */
  const handleSubmit = async (values) => {
    try {
      // Convert UI -> backend format
      const convertedQuestions = questions.map((q) => {
        const correctIndex = q.answers.findIndex((a) => a.isCorrect);
        const correctLetter = String.fromCharCode(65 + correctIndex);

        return {
          questionText: q.questionText,
          options: {
            A: q.answers[0]?.text || '',
            B: q.answers[1]?.text || '',
            C: q.answers[2]?.text || '',
            D: q.answers[3]?.text || '',
          },
          correctAnswer: correctLetter,
        };
      });

      const payload = {
        name: values.name,
        subject: values.subject,
        grade: values.grade, // thêm grade
        chapters: [
          {
            name: values.chapter, // form đã có "chapter"
            questions: convertedQuestions,
          },
        ],
      };

      // CALL API
      await apiClient.post('/quizzes', payload);

      message.success('Thêm quizz thành công!');
      navigate('/quizz-mana');
    } catch (err) {
      console.error(err);
      message.error('Thêm quizz thất bại!');
    }
  };

  return (
    <div>
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
                  <span className="font-semibold text-[#23408e]">Thêm quizz</span>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className=" mx-auto p-4 bg-white rounded-none shadow">
        <h2 className="text-xl font-semibold ">Thêm quizz mới</h2>

        <Form className="custom-form" layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên quizz" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên quizz' }]}>
            <Input placeholder="Nhập tên quizz" />
          </Form.Item>

          <Form.Item label="Môn học" name="subject" rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
            <Select
              placeholder="Chọn môn học"
              options={[
                { value: 'Toán', label: 'Toán' },
                { value: 'Ngữ Văn', label: 'Ngữ Văn' },
                { value: 'Lịch sử', label: 'Lịch sử' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Khối lớp" name="grade" rules={[{ required: true, message: 'Vui lòng nhập khối lớp' }]}>
            <Input placeholder="VD: 10" />
          </Form.Item>

          <Form.Item label="Chương" name="chapter" rules={[{ required: true, message: 'Vui lòng nhập chương' }]}>
            <Input placeholder="Chương 1, Chương 2..." />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>

          <h3 className="text-lg font-semibold mb-1">Danh sách câu hỏi</h3>

          {questions.map((q, qIndex) => (
            <Card
              key={qIndex}
              className=" border border-gray-300 rounded-none"
              title={
                <div className="flex justify-between">
                  <span>
                    Câu {qIndex + 1} {q.answers.some((a) => a.isCorrect) ? <Tag color="green">Đã chọn đáp án đúng</Tag> : <Tag color="red">Chưa chọn đáp án</Tag>}
                  </span>

                  <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteQuestion(qIndex)} />
                </div>
              }
            >
              <Input placeholder="Nội dung câu hỏi" className="mb-1" value={q.questionText} onChange={(e) => handleChangeQuestion(qIndex, e.target.value)} />

              {q.answers.map((a, aIndex) => (
                <div key={aIndex} className="flex items-center gap-1 mb-1">
                  <Input placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`} value={a.text} onChange={(e) => handleChangeAnswer(qIndex, aIndex, e.target.value)} />

                  <Button type={a.isCorrect ? 'primary' : 'default'} onClick={() => handleCorrectAnswer(qIndex, aIndex)}>
                    Đúng
                  </Button>
                </div>
              ))}
            </Card>
          ))}

          <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddQuestion} className="mt-1 rounded-none">
            Thêm câu hỏi
          </Button>

          <div className="mt-2 flex justify-end gap-1">
            <Button onClick={() => navigate('/quizz-mana')}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu quizz
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
