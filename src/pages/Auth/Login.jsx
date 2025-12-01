import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginAPI } from '../../services/authService';
import { message, Modal, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning('Vui lòng nhập tài khoản và mật khẩu!');
      return;
    }

    setLoading(true);

    try {
      const res = await loginAPI(email, password);
      const user = res.data.data;

      // We are not using localStorage for auth state as requested.
      // Session cookie (HttpOnly) is handled by the browser.
      
      // If you need the role for UI logic, you might need to fetch it, 
      // or store JUST the role in localStorage (if permitted by user "don't store AUTH in LS").
      // Assuming we proceed without storing user object for auth checks.
      
      message.success('Đăng nhập thành công!');

      if (user.role === 'teacher') navigate('/student-mana');
      else if (user.role === 'admin') navigate('/user-mana');
      else navigate('/');
    } catch (err) {
      message.error('Sai tài khoản hoặc mật khẩu!');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
      {/* Modal loading */}
      <Modal open={loading} footer={null} closable={false} centered bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Spin size="large" />
        <span>Đang đăng nhập...</span>
      </Modal>

      {/* Form login */}
      <div className="bg-white/90 shadow-2xl rounded-2xl p-10 w-[400px] max-w-[90%] backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">ĐĂNG NHẬP</h1>
        <p className="text-center text-gray-500 mb-8">Xin chào! Vui lòng đăng nhập</p>

        <div className="space-y-4">
          {/* Email input */}
          <input
            type="text"
            placeholder="Nhập tài khoản"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          {/* Password input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </div>
          </div>

          <button onClick={handleLogin} className="w-full bg-[#23408E] text-white py-2 rounded-lg font-semibold hover:bg-[#304d9b] transition-colors">
            ĐĂNG NHẬP
          </button>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-cyan-500" />
            <span>Ghi nhớ</span>
          </label>

          <span onClick={() => navigate('/forgot-password')} className="text-[#23408E] hover:underline cursor-pointer">
            Quên mật khẩu?
          </span>
        </div>
      </div>
    </div>
  );
}
