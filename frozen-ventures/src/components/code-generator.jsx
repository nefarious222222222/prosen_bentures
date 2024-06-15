import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export const FiveDigitCodeGenerator = ({ inputEmail, code, setCode }) => {
  const formRef = useRef();
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [sending, setSending] = useState(false);

  const generateFiveDigitCode = () => {
    const min = 10000;
    const max = 99999;
    const generatedCode = Math.floor(Math.random() * (max - min + 1)) + min;
    setCode(generatedCode.toString());
    setCodeGenerated(true);
  };

  const sendEmail = () => {
    setSending(true);
    emailjs
      .sendForm("service_yrqqfsg", "template_020stgg", formRef.current, {
        publicKey: "kPDIxzyq9fPhvJqKS",
      })
      .then(
        (response) => {
          console.log("Email sent successfully!", response);
          setSending(false);
        })
      .catch(
        (error) => {
          console.error("Email send failed!", error);
          setSending(false);
        });
  };

  const handleClick = (e) => {
    e.preventDefault();
    generateFiveDigitCode();
    sendEmail();
  };

  return (
    <div className="code-generator">
      <button className="code-button" onClick={handleClick} disabled={sending}>
        {sending ? "Sending..." : codeGenerated ? "Resend Code" : "Send Code"}
      </button>

      <form ref={formRef} style={{ display: "none" }} onSubmit={sendEmail}>
        <input type="text" name="email" value={inputEmail} readOnly />
        <input type="text" name="code" value={code} readOnly />
        <input type="text" name="subject" value="Verification Code" readOnly />
      </form>
    </div>
  );
};