import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { message, Spin, Modal, Button } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: 'info', // 'success' | 'error' | 'info'
    title: '',
    content: '',
    onOk: () => {},
  });

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      await apiClient.get(`/auth/reset/${token}`);
      setIsValidToken(true);
    } catch (err) {
      console.error(err);
      // Token invalid is handled by the main render return
      setIsValidToken(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      message.warning('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (password !== confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/auth/set-new-password', {
        token,
        password
      });
      
      setModalConfig({
        visible: true,
        type: 'success',
        title: 'Thành công!',
        content: 'Mật khẩu của bạn đã được đặt lại thành công. Hãy đăng nhập ngay.',
        onOk: () => {
          setModalConfig(prev => ({ ...prev, visible: false }));
          navigate('/login');
        }
      });

    } catch (err) {
      console.error(err);
      setModalConfig({
        visible: true,
        type: 'error',
        title: 'Thất bại',
        content: 'Đặt lại mật khẩu thất bại! ' + (err.response?.data?.message || 'Đã có lỗi xảy ra.'),
        onOk: () => setModalConfig(prev => ({ ...prev, visible: false }))
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center flex flex-col items-center">
          <Spin size="large" />
          <p className="mt-4 text-slate-500">Đang kiểm tra token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">LỖI!</h1>
          <p className="text-slate-500 mb-6">Link reset mật khẩu không hợp lệ hoặc đã hết hạn.</p>
          <button 
            className="w-full bg-[#23408E] text-white py-2 rounded-lg font-semibold hover:bg-[#304d9b] transition duration-200" 
            onClick={() => navigate('/forgot-password')}
          >
            GỬI LẠI YÊU CẦU
          </button>
          <div className="mt-4">
            <span className="text-[#23408E] cursor-pointer hover:underline" onClick={() => navigate('/login')}>
              Quay lại đăng nhập
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">ĐẶT LẠI MẬT KHẨU</h1>
        <p className="text-slate-500 mb-6">Nhập mật khẩu mới của bạn</p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu mới"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button 
            className={`w-full bg-[#23408E] text-white py-2 rounded-lg font-semibold hover:bg-[#304d9b] transition duration-200 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'ĐANG XỬ LÝ...' : 'THAY ĐỔI MẬT KHẨU'}
          </button>
        </div>
      </div>

      {/* Universal Feedback Modal */}
      <Modal
        title={modalConfig.title}
        open={modalConfig.visible}
        onOk={modalConfig.onOk}
        onCancel={() => setModalConfig(prev => ({ ...prev, visible: false }))}
        centered
        footer={[
          <Button 
            key="ok" 
            type="primary" 
            onClick={modalConfig.onOk}
            style={{ backgroundColor: modalConfig.type === 'error' ? '#ff4d4f' : '#23408E' }}
          >
            {modalConfig.type === 'error' ? 'Thử lại' : 'Đăng nhập ngay'}
          </Button>
        ]}
      >
        <p>{modalConfig.content}</p>
      </Modal>
    </div>
  );
}
