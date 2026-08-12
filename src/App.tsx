import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import HomePage from '@/pages/HomePage';
import LearnPage from '@/pages/LearnPage';
import TopicPage from '@/pages/TopicPage';
import VisualizerPage from '@/pages/VisualizerPage';
import ProblemsPage from '@/pages/ProblemsPage';
import RoadmapPage from '@/pages/RoadmapPage';
import DashboardPage from '@/pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/topic/:topicId" element={<TopicPage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/progress" element={<DashboardPage />} />
          
          {/* Temporary aliases for MVP */}
          <Route path="/oop" element={<LearnPage />} />
          <Route path="/challenges" element={<ProblemsPage />} />
          <Route path="/achievements" element={<DashboardPage />} />
          <Route path="/settings" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
