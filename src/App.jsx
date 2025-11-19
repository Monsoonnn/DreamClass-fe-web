import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Layout from './components/Layout';
import StudentMana from './pages/Student/StudentMana';
import MissonMana from './pages/Mission/MissionMana';
import RankingMana from './pages/Ranking/RankingMana';
import RewardMana from './pages/Reward/RewardMana';
import UserMana from './pages/UserMana/UserMana';
import StoreMana from './pages/StoreMana/StoreMana';
import RankingServer from './pages/RankingServer/RankingServer';
import AddUser from './pages/UserMana/components/AddUser';
import UserDetail from './pages/UserMana/components/UserDetail';
import StudentDetail from './pages/Student/components/StudentDetail';
import RankingDetail from './pages/Ranking/components/RankingDetail';
import RankingServerDetail from './pages/RankingServer/components/RankingServerDetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/student-mana"
          element={
            <Layout>
              <StudentMana />
            </Layout>
          }
        />
        <Route
          path="/student-mana/view/:id"
          element={
            <Layout>
              <StudentDetail />
            </Layout>
          }
        />

        <Route
          path="/mission-mana"
          element={
            <Layout>
              <MissonMana />
            </Layout>
          }
        />
        <Route
          path="/ranking-mana"
          element={
            <Layout>
              <RankingMana />
            </Layout>
          }
        />
        <Route
          path="/ranking-mana/view/:id"
          element={
            <Layout>
              <RankingDetail />
            </Layout>
          }
        />
        <Route
          path="/reward-mana"
          element={
            <Layout>
              <RewardMana />
            </Layout>
          }
        />
        <Route
          path="/user-mana"
          element={
            <Layout>
              <UserMana />
            </Layout>
          }
        />
        <Route
          path="/user-mana/add"
          element={
            <Layout>
              <AddUser />
            </Layout>
          }
        />
        <Route
          path="/user-mana/view/:id"
          element={
            <Layout>
              <UserDetail />
            </Layout>
          }
        />

        <Route
          path="/store-mana"
          element={
            <Layout>
              <StoreMana />
            </Layout>
          }
        />
        <Route
          path="/ranking-server"
          element={
            <Layout>
              <RankingServer />
            </Layout>
          }
        />
        <Route
          path="/ranking-server/view/:id"
          element={
            <Layout>
              <RankingServerDetail />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
