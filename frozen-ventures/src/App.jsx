import React, { useState } from "react";
import "./assets/styles/App.css";
import { UserContextProvider } from "./context/user-context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/home/home";
import { Sign } from "./pages/sign/sign";
import { Menu } from "./pages/menu/menu";

function App() {
  return (
    <div className="app">
      <UserContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;
