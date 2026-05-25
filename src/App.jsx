import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Components
import Home from './pages/Home';
import RegisterDonor from './pages/RegisterDonor';
import RegisterPatient from './pages/RegisterPatient';
import RegisterHospital from './pages/RegisterHospital';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminLogin from './pages/AdminLogin';
import MatchResults from './pages/MatchResults';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorks from './pages/HowItWorks';
import Logo from './components/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-10" />
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-gray-600 font-medium text-sm">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/register-donor" className="hover:text-blue-600 transition-colors">Donor</Link>
          <Link to="/register-patient" className="hover:text-blue-600 transition-colors">Patient</Link>
          <Link to="/register-hospital" className="hover:text-blue-600 transition-colors bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">Hospital Registration</Link>
          <Link to="/admin" className="hover:text-blue-600 transition-colors">Hospital Login</Link>
          <Link to="/how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
        </div>
        
        {/* Mobile Nav Toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 flex flex-col p-4 gap-2 md:hidden shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-gray-50 rounded text-gray-700">Home</Link>
          <Link to="/register-donor" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-gray-50 rounded text-gray-700">Register Donor</Link>
          <Link to="/register-patient" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-gray-50 rounded text-gray-700">Register Patient</Link>
          <Link to="/register-hospital" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-gray-50 rounded text-blue-600 font-medium">Hospital Registration</Link>
          <Link to="/admin" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-gray-50 rounded text-gray-700">Hospital Login</Link>
          <Link to="/how-it-works" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-gray-50 rounded text-gray-700">How it Works</Link>
        </div>
      )}
    </nav>
  );
}

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 mt-16">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Logo className="h-12" isDark={true} />
        </div>
        <p className="max-w-xs text-sm leading-relaxed">
          BoneMarrowDonation connects life-saving donors with patients in need through advanced HLA typing analysis.
        </p>
      </div>
      <div>
        <h4 className="text-white font-medium mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
          <li><Link to="/register-donor" className="hover:text-blue-400 transition-colors">Register as Donor</Link></li>
          <li><Link to="/register-patient" className="hover:text-blue-400 transition-colors">Find a Donor</Link></li>
          <li><Link to="/register-hospital" className="hover:text-blue-400 transition-colors">Hospital Registration</Link></li>
          <li><Link to="/how-it-works" className="hover:text-blue-400 transition-colors">Matching Logic</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-medium mb-3">Medical Resources</h4>
        <ul className="space-y-2 text-sm">
          <li className="hover:text-blue-400 cursor-pointer transition-colors">HLA Typing Guide</li>
          <li className="hover:text-blue-400 cursor-pointer transition-colors">Bone Marrow FAQ</li>
          <li className="hover:text-blue-400 cursor-pointer transition-colors">Donor Preparation</li>
          <li className="hover:text-blue-400 cursor-pointer transition-colors">Recovery Info</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 text-center text-xs">
      <p>&copy; 2026 BoneMarrowDonation. Designed for life-saving connections.</p>
    </div>
  </footer>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register-donor" element={<RegisterDonor />} />
            <Route path="/register-patient" element={<RegisterPatient />} />
            <Route path="/register-hospital" element={<RegisterHospital />} />
            <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
            <Route path="/results/:patientId" element={<MatchResults />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
