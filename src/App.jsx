import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './AppContext';
import GlobalOverview from './pages/GlobalOverview';
import GlobalMap from './pages/GlobalMap';
import CountryIntelligence from './pages/CountryIntelligence';
import CarbonMarkets from './pages/CarbonMarkets';
import Methodologies from './pages/Methodologies';
import ProjectExplorer from './pages/ProjectExplorer';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import NewsIntelligence from './pages/NewsIntelligence';
import MarineSpatialPlanning from './pages/MarineSpatialPlanning';
import DocumentLibrary from './pages/DocumentLibrary';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<GlobalOverview />} />
            <Route path="/map" element={<GlobalMap />} />
            <Route path="/country" element={<CountryIntelligence />} />
            <Route path="/markets" element={<CarbonMarkets />} />
            <Route path="/methodologies" element={<Methodologies />} />
            <Route path="/projects" element={<ProjectExplorer />} />
            <Route path="/projects/table" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/news" element={<NewsIntelligence />} />
            <Route path="/msp" element={<MarineSpatialPlanning />} />
            <Route path="/documents" element={<DocumentLibrary />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}
