import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Hero } from './components/home/hero';
import { Navbar } from './components/layout/navbar';
import { RideMap } from './components/map/ride-map';
import { DriverVerification } from './components/profile/DriverVerification';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/ride" element={<RideMap />} />
          <Route path="/driver/verify" element={<DriverVerification />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;