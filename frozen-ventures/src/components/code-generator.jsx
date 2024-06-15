import React, { useState } from "react";
import emailjs from "@emailjs/browser";

export const FiveDigitCodeGenerator = ({ inputEmail, setCode }) => {
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [sending, setSending] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    const min = 10000;
    const max = 99999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    setCode(code.toString());
    setCodeGenerated(true);
    setSending(true);

    emailjs
      .send("service_yrqqfsg", "template_020stgg", {
        email: inputEmail,
        code: code.toString(),
        subject: "Verification Code",
      }, "kPDIxzyq9fPhvJqKS")
      .then((response) => {
        console.log("Email sent successfully!", response);
        setSending(false);
      })
      .catch((error) => {
        console.error("Email send failed!", error);
        setSending(false);
      });
  };

  return (
    <div className="code-generator">
      <button className="code-button" onClick={handleClick} disabled={sending}>
        {sending ? "Sending..." : codeGenerated ? "Resend Code" : "Send Code"}
      </button>
    </div>
  );
};