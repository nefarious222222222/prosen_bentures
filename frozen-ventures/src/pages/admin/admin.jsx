import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion as m, easeInOut } from "framer-motion";
import UserList from "./components/user-list";
import VerifyDocs from "./components/verify-docs";
import AddUser from "./components/add-user";

const App = () => {
  return (
    <Router>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: easeInOut }}
        className="container admin"
      >
        <nav>
          <ul>
            <li><Link to="/user-list">User List</Link></li>
            <li><Link to="/verify-docs">Verify Documents</Link></li>
            <li><Link to="/add-user">Add User</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="user-list" element={<UserList />} />
          <Route path="verify-docs" element={<VerifyDocs />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </m.div>
    </Router>
  );
};

export default App;
