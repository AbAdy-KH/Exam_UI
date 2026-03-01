import { HomePage } from './pages/home/home.jsx';
import { LoginPage } from './pages/auth/login.jsx';
import { RegisterPage } from './pages/auth/register.jsx';
import { ProfilePage } from './pages/profile/profile.jsx';
import { ExamResultsHistoryPage } from './pages/exam-results-history/exam-results-history.jsx';
import { ExamDetailsPage } from './pages/exam-details/exam-details.jsx';
import { EditExamPage } from './pages/edit-exam/edit-exam.jsx';
import { CreateExamPage } from './pages/create-exam/create-exam.jsx';
import { StartExamPage } from './pages/start-exam/start-exam.jsx';
import { ShowExamResultPage } from './pages/mesc/show-exam-result.jsx';
import { ExamResultDetailsPage } from './pages/exam-result-details/exam-result-details.jsx'
import { FindUserPage } from './pages/find-user/find-user.jsx'
import { Routes, Route } from 'react-router';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/exam-results-history' element={<ExamResultsHistoryPage />} />
      <Route path='/exam-details' element={<ExamDetailsPage />} />
      <Route path='/edit-exam' element={<EditExamPage />} />
      <Route path='/create-exam' element={<CreateExamPage />} />
      <Route path='/start-exam' element={<StartExamPage />} />
      <Route path='/show-exam-result' element={<ShowExamResultPage />} />
      <Route path='/exam-result-details' element={<ExamResultDetailsPage />} />
      <Route path='/find-user' element={<FindUserPage />} />
    </Routes>
  )
}

export default App
