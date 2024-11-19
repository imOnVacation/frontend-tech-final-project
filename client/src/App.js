import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import TicketCreation from './pages/TicketCreation';
import Header from './components/Header';
import TicketsByStatusAndMonth from './pages/TicketsByStatusAndMonth';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/search' element={<Search />} />
        <Route path='/ticketcreation' element={<TicketCreation />} />
        <Route path='/tickets/list' element={<TicketsByStatusAndMonth />} />
      </Routes>
    </Router>
  );
}
