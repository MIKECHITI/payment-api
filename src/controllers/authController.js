const { register, login } = require('../services/authService');

const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.status = 400;
      throw error;
    }

    const result = await register(name, email, password);
    res.status(201).json({
      message: 'User registered successfully',
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    const result = await login(email, password);
    res.json({
      message: 'Login successful',
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch (error) {
    if (!error.status) error.status = 401;
    next(error);
  }
};

module.exports = { registerController, loginController };
