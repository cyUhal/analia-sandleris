/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import Obras from './pages/Obras';
import Bio from './pages/Bio';
import Prensa from './pages/Prensa';
import Contacto from './pages/Contacto';
import Curriculum from './pages/Curriculum';

// Helper to scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-paper text-ink min-h-screen selection:bg-accent/30 selection:text-ink font-serif antialiased">
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/obras" element={<Obras />} />
            <Route path="/obras/:category" element={<Obras />} />
            <Route path="/bio" element={<Bio />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/cv" element={<Curriculum />} />
            <Route path="/prensa" element={<Prensa />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
