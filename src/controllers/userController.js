const { searchUsersByEmail } = require('../services/userService');

const userSearchController = async (req, res, next) => {
  try {
    const { email } = req.query;
    const users = await searchUsersByEmail(email);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = { userSearchController };
