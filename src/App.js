import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; // Example of another page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Commented out the login route to disable login */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;