const { transfer, getTransactionHistory } = require('../services/transactionService');

const transferController = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const { receiverId, amount, description } = req.body;

    if (receiverId === undefined || receiverId === null || amount === undefined || amount === null) {
      const error = new Error('Receiver ID and amount are required');
      error.status = 400;
      throw error;
    }

    const parsedReceiverId = Number(receiverId);
    if (!Number.isInteger(parsedReceiverId) || parsedReceiverId <= 0) {
      const error = new Error('Receiver ID must be a positive integer');
      error.status = 400;
      throw error;
    }

    const idempotencyKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];

    const transaction = await transfer(
      senderId,
      parsedReceiverId,
      amount,
      description,
      idempotencyKey
    );

    res.status(201).json({
      message: 'Transfer successful',
      transaction: {
        id: transaction.id,
        reference: transaction.reference,
        from: transaction.sender.name,
        to: transaction.receiver.name,
        amount: transaction.amount,
        status: transaction.status,
        description: transaction.description,
        timestamp: transaction.createdAt,
      },
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    next(error);
  }
};

const historyController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const transactions = await getTransactionHistory(userId);

    res.json({
      transactions: transactions.map((tx) => ({
        id: tx.id,
        reference: tx.reference,
        from: tx.sender.name,
        to: tx.receiver.name,
        amount: tx.amount,
        status: tx.status,
        type: tx.senderId === userId ? 'sent' : 'received',
        timestamp: tx.createdAt,
      })),
      total: transactions.length,
    });
  } catch (error) {
    if (!error.status) error.status = 400;
    next(error);
  }
};

module.exports = { transferController, historyController };
