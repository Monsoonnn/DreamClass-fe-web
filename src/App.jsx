import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Layout from './components/Layout';
import StudentMana from './pages/Student/StudentMana';
import StudentDetail from './pages/Student/components/StudentDetail';
import MissonMana from './pages/Mission/MissionMana';
import RankingMana from './pages/Ranking/RankingMana';
import RankingDetail from './pages/Ranking/components/RankingDetail';
import RewardMana from './pages/Reward/RewardMana';
import UserMana from './pages/UserMana/UserMana';
import AddUser from './pages/UserMana/components/AddUser';
import UserDetail from './pages/UserMana/components/UserDetail';
import RankingServer from './pages/RankingServer/RankingServer';
import RankingServerDetail from './pages/RankingServer/components/RankingServerDetail';
import BookMana from './pages/BookMana/BookMana';
import MissionDetail from './pages/Mission/components/MissionDetail';
import AddMission from './pages/Mission/components/AddMission';
import AddReward from './pages/Reward/components/AddReward';
import RewardDetail from './pages/Reward/components/RewardDetail';
import AddBook from './pages/BookMana/components/AddBook';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route KHÔNG dùng layout */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Route DÙNG layout */}
        <Route element={<Layout />}>
          <Route path="/student-mana" element={<StudentMana />} />
          <Route path="/student-mana/view/:id" element={<StudentDetail />} />
          <Route path="/mission-mana" element={<MissonMana />} />
          <Route path="/mission-mana/view/:questId" element={<MissionDetail />} />
          <Route path="/mission-mana/add" element={<AddMission />} />
          <Route path="/ranking-mana" element={<RankingMana />} />
          <Route path="/ranking-mana/view/:id" element={<RankingDetail />} />
          <Route path="/reward-mana" element={<RewardMana />} />
          <Route path="/reward-mana/add" element={<AddReward />} />
          <Route path="/reward-mana/detail/:key" element={<RewardDetail />} />
          <Route path="/user-mana" element={<UserMana />} />
          <Route path="/user-mana/add" element={<AddUser />} />
          <Route path="/user-mana/view/:id" element={<UserDetail />} />
          <Route path="/ranking-server" element={<RankingServer />} />
          <Route path="/ranking-server/view/:id" element={<RankingServerDetail />} />
          <Route path="/book-mana" element={<BookMana />} />
          <Route path="/book-mana/add" element={<AddBook />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
