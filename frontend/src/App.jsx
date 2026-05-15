import {Routes, Route ,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ModernHomepage from "./pages/ModernHomepage";
import LandingPage from "./pages/LandingPage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import AdminUpdate from "./components/AdminUpdate"
import AdminEdit from "./components/AdminEdit"
import ContestList from "./pages/ContestList";
import ContestDetail from "./pages/ContestDetail";
import ContestArena from "./pages/ContestArena";
import ContestLeaderboard from "./pages/ContestLeaderboard";
import AdminContestCreate from "./pages/AdminContestCreate";
import AdminContestManage from "./pages/AdminContestManage";
import InterviewPage from "./pages/InterviewPage";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Prevent multiple auth checks
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    if (!loading && !authChecked) {
      setAuthChecked(true);
    }
  }, [loading, authChecked]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cc-bg-primary)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <span className="loading loading-spinner loading-lg" style={{ color: 'var(--cc-primary)' }}></span>
          <p className="text-sm" style={{ color: 'var(--cc-text-muted)' }}>Loading CodeCrest...</p>
        </div>
      </div>
    );
  }

  return(
  <>
    <Routes>
      <Route path="/" element={
        isAuthenticated ? 
        <ModernHomepage /> : 
        <LandingPage />
      } />
      
      <Route path="/login" element={
        isAuthenticated ? 
        <Navigate to="/" replace /> : 
        <Login />
      } />
      
      <Route path="/signup" element={
        isAuthenticated ? 
        <Navigate to="/" replace /> : 
        <Signup />
      } />
      
      <Route path="/admin" element={
        isAuthenticated && user?.role === 'admin' ? 
        <Admin /> : 
        <Navigate to="/" replace />
      } />
      
      <Route path="/admin/create" element={
        isAuthenticated && user?.role === 'admin' ? 
        <AdminPanel /> : 
        <Navigate to="/" replace />
      } />
      
      <Route path="/admin/delete" element={
        isAuthenticated && user?.role === 'admin' ? 
        <AdminDelete /> : 
        <Navigate to="/" replace />
      } />
      
      <Route path="/admin/update" element={
        isAuthenticated && user?.role === 'admin' ? 
        <AdminUpdate /> : 
        <Navigate to="/" replace />
      } />
      
      <Route path="/admin/update/:problemId" element={
        isAuthenticated && user?.role === 'admin' ? 
        <AdminEdit /> : 
        <Navigate to="/" replace />
      } />
      
      <Route path="/admin/video" element={
        isAuthenticated && user?.role === 'admin' ? 
        <AdminVideo /> : 
        <Navigate to="/" replace />
      } />
      
      <Route path="/admin/upload/:problemId" element={
        isAuthenticated && user?.role === 'admin' ? 
        <AdminUpload /> : 
        <Navigate to="/" replace />
      } />
      
      <Route path="/problem/:problemId" element={<ProblemPage />} />
      <Route path="/problems" element={<ModernHomepage />} />
      
      <Route path="/contest" element={<ContestList />} />
      <Route path="/contest/:contestId" element={<ContestDetail />} />
      <Route path="/contest/:contestId/problem/:problemId" element={
        isAuthenticated ? <ContestArena /> : <Navigate to="/" replace />
      } />
      <Route path="/contest/:contestId/leaderboard" element={<ContestLeaderboard />} />
      
      <Route path="/admin/contest" element={
        isAuthenticated && user?.role === 'admin' ? <AdminContestManage /> : <Navigate to="/" replace />
      } />
      <Route path="/admin/contest/create" element={
        isAuthenticated && user?.role === 'admin' ? <AdminContestCreate /> : <Navigate to="/" replace />
      } />
      <Route path="/admin/contest/edit/:contestId" element={
        isAuthenticated && user?.role === 'admin' ? <AdminContestCreate /> : <Navigate to="/" replace />
      } />
      
      <Route path="/discuss" element={<Navigate to="/" replace />} />
      <Route path="/interview" element={<InterviewPage />} />
      
    </Routes>
  </>
  )
}

export default App;