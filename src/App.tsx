import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DocsPage } from './pages/DocsPage';
import { HomePage } from './pages/HomePage';
import { HymnPage } from './pages/HymnPage';
import { MurtiPage } from './pages/MurtiPage';
import { TranslatorPage } from './pages/TranslatorPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/hymn" element={<HymnPage />} />
        <Route path="/murti" element={<MurtiPage />} />
        <Route path="/translator" element={<TranslatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
