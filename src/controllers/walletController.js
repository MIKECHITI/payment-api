const { getBalance, deposit } = require('../services/walletService');

const balanceController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const wallet = await getBalance(userId);

    res.json({
      balance: wallet.balance,
      walletId: wallet.id,
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    next(error);
  }
};

const depositController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (amount === undefined || amount === null) {
      const error = new Error('Amount is required');
      error.status = 400;
      throw error;
    }

    const wallet = await deposit(userId, amount);

    res.json({
      message: 'Deposit successful',
      balance: wallet.balance,
      amount: parseFloat(amount),
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    next(error);
  }
};

module.exports = { balanceController, depositController };
