import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './AppContext';
import GlobalOverview from './pages/GlobalOverview';
import GlobalMap from './pages/GlobalMap';
import CountryIntelligence from './pages/CountryIntelligence';
import ArticleSixPolicy from './pages/ArticleSixPolicy';
import CarbonMarkets from './pages/CarbonMarkets';
import Methodologies from './pages/Methodologies';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import NewsIntelligence from './pages/NewsIntelligence';
import MarineSpatialPlanning from './pages/MarineSpatialPlanning';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<GlobalOverview />} />
            <Route path="/map" element={<GlobalMap />} />
            <Route path="/country" element={<CountryIntelligence />} />
            <Route path="/policy" element={<ArticleSixPolicy />} />
            <Route path="/markets" element={<CarbonMarkets />} />
            <Route path="/methodologies" element={<Methodologies />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/news" element={<NewsIntelligence />} />
            <Route path="/msp" element={<MarineSpatialPlanning />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}
