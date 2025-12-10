import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthAPI, loginAPI, logoutAPI } from '../services/authService';
import apiClient from '../services/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch full profile based on role
  const fetchFullProfile = async (role) => {
    let endpoint = '/auth/profile'; // Default/Admin
    if (role === 'student') endpoint = '/players/profile';
    else if (role === 'teacher') endpoint = '/teacher/profile';
    
    const res = await apiClient.get(endpoint);
    return res.data?.data || res.data;
  };

  // Check authentication status on mount
  useEffect(() => {
    const verifyUser = async () => {
      const token = Cookies.get('token');
      const savedUser = Cookies.get('user_data');

      // Nếu có user đã lưu, set ngay để không bị trắng trang/mất login
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Lỗi parse user_data', e);
        }
      }

      // Cleanup old localStorage data if exists
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('Đang verify user với token:', token);
        // 1. Get Basic Info (Role)
        const response = await checkAuthAPI();
        const basicData = response.data?.data || response.data;

        // 2. Fetch Full Profile
        if (basicData && basicData.role) {
           try {
             const fullData = await fetchFullProfile(basicData.role);
             setUser(fullData);
             Cookies.set('user_data', JSON.stringify(fullData), { expires: 7 });
           } catch (profileErr) {
             console.warn('Failed to fetch full profile, using basic data:', profileErr);
             setUser(basicData);
             Cookies.set('user_data', JSON.stringify(basicData), { expires: 7 });
           }
        } else {
           setUser(basicData);
           Cookies.set('user_data', JSON.stringify(basicData), { expires: 7 });
        }

      } catch (error) {
        console.log('Verify failed - Token có thể hết hạn hoặc server từ chối Header');
        // Nếu API báo lỗi 401, lúc đó mới logout hẳn
        if (error.response && error.response.status === 401) {
          Cookies.remove('token');
          Cookies.remove('user_data');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (username, password) => {
    // 1. Login to get Token
    const response = await loginAPI(username, password);
    const data = response.data;
    
    // Extract token
    const token = data?.token || data?.accessToken || data?.data?.token || data?.data?.accessToken;

    if (!token) {
      throw new Error('Không tìm thấy token trong phản hồi đăng nhập');
    }

    // 2. Save Token
    Cookies.set('token', token, { expires: 7 });

    // 3. Get Role via checkAuthAPI (or use data from login if reliable)
    // We use checkAuthAPI to be safe and consistent
    let basicData = data?.data || data; // Try to use login response first
    
    try {
      if (!basicData?.role) {
         const meRes = await checkAuthAPI();
         basicData = meRes.data?.data || meRes.data;
      }

      // 4. Fetch Full Profile
      if (basicData?.role) {
        const fullData = await fetchFullProfile(basicData.role);
        setUser(fullData);
        Cookies.set('user_data', JSON.stringify(fullData), { expires: 7 });
        return fullData;
      } else {
        // Fallback
        setUser(basicData);
        Cookies.set('user_data', JSON.stringify(basicData), { expires: 7 });
        return basicData;
      }
    } catch (err) {
      console.error('Error fetching full profile during login:', err);
      // Fallback to basic data
      if (basicData) {
        setUser(basicData);
        Cookies.set('user_data', JSON.stringify(basicData), { expires: 7 });
      }
      return basicData;
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      Cookies.remove('token');
      Cookies.remove('user_data');
    }
  };

  const refreshUser = async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await checkAuthAPI();
      const basicData = response.data?.data || response.data;
      
      if (basicData?.role) {
        const fullData = await fetchFullProfile(basicData.role);
        setUser(fullData);
        Cookies.set('user_data', JSON.stringify(fullData), { expires: 7 });
      } else {
        setUser(basicData);
        Cookies.set('user_data', JSON.stringify(basicData), { expires: 7 });
      }
    } catch (error) {
      console.error('Refresh user failed', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    Cookies.set('user_data', JSON.stringify(userData), { expires: 7 });
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
