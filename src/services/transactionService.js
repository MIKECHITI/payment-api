const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const { validateAmount } = require('../utils/validators');

const transfer = async (senderId, receiverId, amount, description, idempotencyKey) => {
  if (!validateAmount(amount)) throw new Error('Invalid amount');
  if (senderId === receiverId) throw new Error('Cannot transfer to yourself');

  if (idempotencyKey && typeof idempotencyKey !== 'string') {
    throw new Error('Idempotency key must be a string');
  }

  if (idempotencyKey) {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { idempotencyKey },
      include: { sender: true, receiver: true },
    });

    if (existingTransaction) {
      return existingTransaction;
    }
  }

  // ATOMIC TRANSACTION: Deduct sender + Add receiver + Log transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check sender's wallet exists and has sufficient balance
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: senderId },
      });

      if (!senderWallet) throw new Error('Sender wallet not found');
      if (Number(senderWallet.balance) < Number(amount)) throw new Error('Insufficient balance');

      // Check receiver exists
      const receiver = await tx.user.findUnique({
        where: { id: receiverId },
      });
      if (!receiver) throw new Error('Receiver not found');

      // Deduct from sender
      await tx.wallet.update({
        where: { userId: senderId },
        data: { balance: { decrement: new Prisma.Decimal(amount) } },
      });

      // Add to receiver
      await tx.wallet.update({
        where: { userId: receiverId },
        data: { balance: { increment: new Prisma.Decimal(amount) } },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          senderId,
          receiverId,
          amount: new Prisma.Decimal(amount),
          status: 'completed',
          description,
          idempotencyKey,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      return transaction;
    });

    return result;
  } catch (error) {
    if (
      idempotencyKey &&
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      error.meta?.target?.includes('idempotency_key')
    ) {
      return prisma.transaction.findUnique({
        where: { idempotencyKey },
        include: { sender: true, receiver: true },
      });
    }

    throw error;
  }
};

const getTransactionHistory = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return transactions;
};

module.exports = { transfer, getTransactionHistory };
