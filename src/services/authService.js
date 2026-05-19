const bcrypt = require('bcryptjs');
const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const { generateToken } = require('../utils/generateToken');
const { validateEmail, validatePassword } = require('../utils/validators');

const register = async (name, email, password) => {
  if (!validateEmail(email)) throw new Error('Invalid email format');
  if (!validatePassword(password)) throw new Error('Password must be at least 8 characters');

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      wallet: {
        create: { balance: new Prisma.Decimal(0) },
      },
    },
    include: { wallet: true },
  });

  const token = generateToken(user.id);
  return { user, token };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { wallet: true },
  });

  if (!user) throw new Error('Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) throw new Error('Invalid email or password');

  const token = generateToken(user.id);
  return { user, token };
};

module.exports = { register, login };
