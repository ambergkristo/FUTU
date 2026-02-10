import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Booking from './pages/Booking';
import BookingStatus from './pages/BookingStatus';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/status" element={<BookingStatus />} />
      </Routes>
    </Router>
  );
}

export default App;
