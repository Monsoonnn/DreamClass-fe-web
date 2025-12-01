import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Layout from './components/Layout';
import StudentMana from './pages/Student/StudentMana';
import StudentDetail from './pages/Student/components/StudentDetail';
import MissionMana from './pages/Mission/MissionMana';
import MissionDetail from './pages/Mission/components/MissionDetail';
import AddMission from './pages/Mission/components/AddMission';
import RankingMana from './pages/Ranking/RankingMana';
import RankingDetail from './pages/Ranking/components/RankingDetail';
import RewardMana from './pages/Reward/RewardMana';
import RewardDetail from './pages/Reward/components/RewardDetail';
import AddReward from './pages/Reward/components/AddReward';
import UserMana from './pages/UserMana/UserMana';
import AddUser from './pages/UserMana/components/AddUser';
import UserDetail from './pages/UserMana/components/UserDetail';
import TeacherDetail from './pages/UserMana/components/TeacherDetail';
import RankingServer from './pages/RankingServer/RankingServer';
import RankingServerDetail from './pages/RankingServer/components/RankingServerDetail';
import BookMana from './pages/BookMana/BookMana';
import AddBook from './pages/BookMana/components/AddBook';
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Trang công khai */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />

          {/* Layout + bảo vệ đăng nhập */}
                      <Route
                        element={
                          <ProtectedRoute>
                            <Layout />
                          </ProtectedRoute>
                        }
                      >
                        {/* -------- GIÁO VIÊN + ADMIN (chung) -------- */}            <Route
              path="/mission-mana"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <MissionMana />
                </RoleRoute>
              }
            />
            <Route
              path="/mission-mana/view/:questId"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <MissionDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/mission-mana/add"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AddMission />
                </RoleRoute>
              }
            />

            <Route
              path="/book-mana"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <BookMana />
                </RoleRoute>
              }
            />
            <Route
              path="/book-mana/add"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <AddBook />
                </RoleRoute>
              }
            />

            {/* -------- CHỈ GIÁO VIÊN -------- */}
            <Route
              path="/student-mana"
              element={
                <RoleRoute allowedRoles={['teacher']}>
                  <StudentMana />
                </RoleRoute>
              }
            />
            <Route
              path="/student-mana/view/:id"
              element={
                <RoleRoute allowedRoles={['teacher']}>
                  <StudentDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-mana"
              element={
                <RoleRoute allowedRoles={['teacher']}>
                  <RankingMana />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-mana/view/:id"
              element={
                <RoleRoute allowedRoles={['teacher']}>
                  <RankingDetail />
                </RoleRoute>
              }
            />

            {/* -------- CHỈ ADMIN -------- */}
            <Route
              path="/reward-mana"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <RewardMana />
                </RoleRoute>
              }
            />
            <Route
              path="/reward-mana/add"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AddReward />
                </RoleRoute>
              }
            />
            <Route
              path="/reward-mana/detail/:key"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <RewardDetail />
                </RoleRoute>
              }
            />

            <Route
              path="/user-mana"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <UserMana />
                </RoleRoute>
              }
            />
            <Route
              path="/user-mana/add"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AddUser />
                </RoleRoute>
              }
            />
            <Route
              path="/user-mana/view/:id"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <UserDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/user-mana/view-teacher/:teacherId"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <TeacherDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-server"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <RankingServer />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-server/view/:id"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <RankingServerDetail />
                </RoleRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
