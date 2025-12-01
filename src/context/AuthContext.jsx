import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthAPI, loginAPI, logoutAPI } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user_data');
      
      // Nếu có user đã lưu, set ngay để không bị trắng trang/mất login
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Lỗi parse user_data", e);
        }
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("Đang verify user với token:", token);
        const response = await checkAuthAPI();
        const userData = response.data?.data || response.data;
        
        // Cập nhật lại user mới nhất từ server
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (error) {
        console.log('Verify failed - Token có thể hết hạn hoặc server từ chối Header');
        // Nếu API báo lỗi 401, lúc đó mới logout hẳn
        if (error.response && error.response.status === 401) {
           localStorage.removeItem('token');
           localStorage.removeItem('user_data');
           setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (username, password) => {
    const response = await loginAPI(username, password);

    const data = response.data;
    const userData = data?.data || data;
    
    // Tìm token ở nhiều vị trí có thể
    const token = data?.token || data?.accessToken || userData?.token || userData?.accessToken;
    
    if (token) {
      localStorage.setItem('token', token);
    }

    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }

    setUser(userData); 
    return userData;
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
      localStorage.clear(); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
