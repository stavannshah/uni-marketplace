import React, { useState } from "react";
import emailjs from "emailjs-com";

const OTPPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState("");

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const validateEmail = (email) => {
    // Check if the email ends with @ufl.edu
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid @ufl.edu email address.");
      return;
    }

    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);

    const templateParams = {
      user_email: email,
      otp: newOtp,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID, // Replace with your EmailJS Service ID
        import.meta.env.VITE_EMAIL_TEMPLATE_ID, // Replace with your EmailJS Template ID
        templateParams,
        import.meta.env.VITE_EMAIL_USER_ID // Replace with your EmailJS User ID
      );
      alert("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {step === 1 && (
        <div className="w-full max-w-md p-4 border rounded shadow">
          <h1 className="text-2xl font-bold">Enter Your Email</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(""); // Clear error when user types
            }}
            placeholder="Enter your email"
            className="w-full p-2 mt-2 border rounded"
          />
          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
          <button
            onClick={sendOtp}
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded"
          >
            Send OTP
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md p-4 border rounded shadow">
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP"
            className="w-full p-2 mt-2 border rounded"
          />
          <button
            onClick={verifyOtp}
            className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded"
          >
            Verify and Login
          </button>
        </div>
      )}
    </div>
  );
};

const MainWebsite = () => {
  const [tab, setTab] = useState("Home");

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  return (
    <div className="h-screen">
      <nav className="flex justify-between p-4 bg-gray-800 text-white">
        <div>
          <button onClick={() => setTab("Home")} className="px-4 py-2">
            Home
          </button>
          <button onClick={() => setTab("Listings")} className="px-4 py-2">
            Listings
          </button>
          <button onClick={() => setTab("Exchange Requests")} className="px-4 py-2">
            Exchange Requests
          </button>
          <button onClick={() => setTab("Your Profile")} className="px-4 py-2">
            Your Profile
          </button>
        </div>
        <button onClick={logout} className="px-4 py-2 bg-red-500 rounded">
          Logout
        </button>
      </nav>
      <div className="p-4">
        <h1 className="text-3xl font-bold">{tab}</h1>
        <p className="mt-2">Welcome to the {tab} page!</p>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  return isLoggedIn ? <MainWebsite /> : <OTPPage onLogin={() => setIsLoggedIn(true)} />;
};

export default App;
