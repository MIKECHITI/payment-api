const prisma = require('../lib/prisma');

const searchUsersByEmail = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Email query parameter is required');
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: email,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 10,
  });

  return users;
};

module.exports = { searchUsersByEmail };
