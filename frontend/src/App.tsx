import React, { useEffect } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import './dist/output.css';
import Header from './components/Header';

function App() {
  
  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='dark'>
      <Router>
        <div className = "flex flex-col h-screen">
        <Header/>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        </div>
        </Router>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default App;
