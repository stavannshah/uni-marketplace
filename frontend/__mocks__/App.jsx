// __mocks__/App.jsx
import React, { useState } from 'react';

// This is a simplified mock of the App component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return isLoggedIn ? (
    <div>Main App Content</div>
  ) : (
    <div>
      <h1>Welcome Back!</h1>
      <button>Send OTP</button>
    </div>
  );
};

export default App;