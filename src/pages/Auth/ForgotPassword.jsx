import { useNavigate } from 'react-router-dom';
export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.jpg')" }}>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">QUÊN MẬT KHẨU</h1>
        <p className="text-slate-500 mb-6">Nhập email hoặc số điện thoại để lấy lại mật khẩu</p>

        <div className="space-y-4">
          <input type="email" placeholder="Nhập email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input type="text" placeholder="Nhập số điện thoại" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400" />
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <button className="w-full bg-[#23408E] text-white py-2 rounded-lg font-semibold hover:bg-[#304d9b] transition duration-200" onClick={() => navigate('/')}>
            THAY ĐỔI MẬT KHẨU
          </button>
        </div>
      </div>
    </div>
  );
}
