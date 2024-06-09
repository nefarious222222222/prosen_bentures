import React from "react";
import "../assets/styles/components.css";
import { motion as m, AnimatePresence, easeInOut } from "framer-motion";

export const ErrorMessage = ({ message }) => {
  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: easeInOut }}
        className="message error"
      >
        <p>{message}</p>
      </m.div>
    </AnimatePresence>
  );
};
