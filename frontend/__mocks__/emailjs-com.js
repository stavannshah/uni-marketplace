// __mocks__/emailjs-com.js
module.exports = {
    send: jest.fn().mockResolvedValue('OK')
  };