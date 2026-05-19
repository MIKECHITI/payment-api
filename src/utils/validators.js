const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateAmount,
};
