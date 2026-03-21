import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Resource_Dashboard from "./pages/Resource_Dashboard/Resource_Dashboard";
import Home from "./pages/Home/Home";
import QuizPage from "./pages/Quiz/QuizPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Resource_Dashboard />} />
        <Route path="/dashboard" element={<Resource_Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer/>} />




      </Routes>
    </Router>
  );
}

export default App;