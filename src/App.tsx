import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InstallPrompt } from './components/InstallPrompt';
import { MainMenu } from './components/MainMenu';
import { SetupDate } from './components/SetupDate';
import { CropAdjust } from './components/CropAdjust';
import { CollageBuilder } from './components/CollageBuilder';

function App() {
  return (
    <Router>
      <div className="w-full h-screen relative bg-zinc-950 flex flex-col items-center justify-center container mx-auto p-4 max-w-md">
        <Routes>
          <Route path="/" element={<InstallPrompt />} />
          <Route path="/menu" element={<MainMenu />} />
          <Route path="/setup" element={<SetupDate />} />
          <Route path="/crop" element={<CropAdjust />} />
          <Route path="/collage" element={<CollageBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
