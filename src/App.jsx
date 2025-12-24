import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
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
import RankingGrade from './pages/RankingServer/components/RankingGrade';
import RankingClass from './pages/RankingServer/components/RankingClass';
import BookMana from './pages/BookMana/BookMana';
import AddBook from './pages/BookMana/components/AddBook';
import LandingPage from './pages/LandingPage/LandingPage';
import QuizzMana from './pages/Quizz/QuizzMana';
import QuizzDetail from './pages/Quizz/components/QuizzDetail';
import QuizzUpdate from './pages/Quizz/components/QuizzUpdate';
import AddQuizz from './pages/Quizz/components/AddQuizz';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import TeacherProfile from './pages/Profile/TeacherProfile';
import StudentProfile from './pages/Profile/StudentProfile';
import TeacherMissionTable from './pages/Mission/components/TeacherMissionTable';
import TeacherMissionDetail from './pages/Mission/components/TeacherMissionDetail';
import StudentQuizList from './pages/Quizz/components/StudentQuizList';
import StudentQuizzDetail from './pages/Quizz/components/StudentQuizzDetail';
import StudentRankingClass from './pages/Ranking/components/StudentRankingClass';
import StudentRankingGrade from './pages/Ranking/components/StudentRankingGrade';
import StudentRankingServer from './pages/Ranking/components/StudentRankingServer';
import StudentBook from './pages/BookMana/components/StudentBook';
import SpinMana from './pages/SpinWheel/SpinMana';
import AddSpin from './pages/SpinWheel/components/AddSpin';
import SpinDetail from './pages/SpinWheel/components/SpinDetail';
import SpinUpdate from './pages/SpinWheel/components/SpinUpdate';
import StudentQuizDetail from './pages/Quizz/components/StudentQuizzDetail';
import StudentQuizResult from './pages/Quizz/components/StudentQuizResult';
import StudyMana from './pages/StudentStudy/StudyMana';
import StudyHistory from './pages/StudentStudy/components/StudyHistory';
import StudyAchievements from './pages/StudentStudy/components/StudyAchievements';
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
          <Route
            path="/reset/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/student-quizz-detail/:id"
            element={
              <RoleRoute allowedRoles={['student']}>
                <StudentQuizDetail />
              </RoleRoute>
            }
          />
          <Route path="/student-quizz-result/:id" element={<StudentQuizResult />} />
          {/* Layout + bảo vệ đăng nhập */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/dashboard"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <Dashboard />
                </RoleRoute>
              }
            />
            {/* <Route path="/teacher-profile" element={<TeacherProfile />} /> */}
            {/* ---Học sinh---- */}
            <Route
              path="/student-profile"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentProfile />
                </RoleRoute>
              }
            />
            <Route
              path="/student-quizz-list"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentQuizList />
                </RoleRoute>
              }
            />
            <Route
              path="/student-ranking-class"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentRankingClass />
                </RoleRoute>
              }
            />
            <Route
              path="/student-ranking-grade"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentRankingGrade />
                </RoleRoute>
              }
            />
            <Route
              path="/student-ranking-server"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentRankingServer />
                </RoleRoute>
              }
            />
            <Route
              path="/student-study"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudyMana />
                </RoleRoute>
              }
            />
            <Route
              path="/student-study-history"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudyHistory />
                </RoleRoute>
              }
            />
            <Route
              path="/student-study-achievement"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudyAchievements />
                </RoleRoute>
              }
            />
            <Route
              path="/student-book"
              element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentBook />
                </RoleRoute>
              }
            />
            {/* -------- GIÁO VIÊN + ADMIN (chung) -------- */}{' '}
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
            <Route
              path="/quizz-mana"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <QuizzMana />
                </RoleRoute>
              }
            />
            <Route
              path="/quizz-mana/view/:quizzId"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <QuizzDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/quizz-mana/update/:quizzId"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <QuizzUpdate />
                </RoleRoute>
              }
            />
            <Route
              path="/quizz-mana/add"
              element={
                <RoleRoute allowedRoles={['teacher', 'admin']}>
                  <AddQuizz />
                </RoleRoute>
              }
            />
            {/* -------- CHỈ GIÁO VIÊN -------- */}
            <Route
              path="/teacher-profile"
              element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherProfile />
                </RoleRoute>
              }
            />
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
              path="/teacher-mission-mana"
              element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherMissionTable />
                </RoleRoute>
              }
            />
            <Route
              path="/teacher-mission-mana/view/:questId"
              element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherMissionDetail />
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
                <RoleRoute allowedRoles={['admin']}>
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
              path="/item-mana"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <RewardMana />
                </RoleRoute>
              }
            />
            <Route
              path="/item-mana/add"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AddReward />
                </RoleRoute>
              }
            />
            <Route
              path="/item-mana/detail/:itemId"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <RewardDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/spin-mana"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <SpinMana />
                </RoleRoute>
              }
            />
            <Route
              path="/spin-mana/add"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AddSpin />
                </RoleRoute>
              }
            />
            <Route
              path="/spin-mana/detail/:id"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <SpinDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/spin-mana/edit/:id"
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <SpinUpdate />
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
                <RoleRoute allowedRoles={['admin', 'teacher']}>
                  <RankingServer />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-server/view/:id"
              element={
                <RoleRoute allowedRoles={['admin', 'teacher']}>
                  <RankingServerDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-grade"
              element={
                <RoleRoute allowedRoles={['admin', 'teacher']}>
                  <RankingGrade />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-grade/view/:id"
              element={
                <RoleRoute allowedRoles={['admin', 'teacher']}>
                  <RankingServerDetail />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-class"
              element={
                <RoleRoute allowedRoles={['admin', 'teacher']}>
                  <RankingClass />
                </RoleRoute>
              }
            />
            <Route
              path="/ranking-class/view/:id"
              element={
                <RoleRoute allowedRoles={['admin', 'teacher']}>
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
