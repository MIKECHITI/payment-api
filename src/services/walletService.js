const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const { validateAmount } = require('../utils/validators');

const getBalance = async (userId) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) throw new Error('Wallet not found');
  return wallet;
};

const deposit = async (userId, amount) => {
  if (!validateAmount(amount)) throw new Error('Invalid amount');

  const wallet = await prisma.wallet.update({
    where: { userId },
    data: {
      balance: {
        increment: new Prisma.Decimal(amount),
      },
    },
  });

  return wallet;
};

module.exports = { getBalance, deposit };
