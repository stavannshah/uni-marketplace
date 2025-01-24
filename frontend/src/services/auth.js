import axios from 'axios';

const API_URL = 'http://localhost:8080';

const sendOTP = (email) => {
  return axios.post(`${API_URL}/send-otp`, { email });
};

const verifyOTP = (email, otp) => {
  return axios.post(`${API_URL}/verify-otp`, { email, otp });
};

export default { sendOTP, verifyOTP };
