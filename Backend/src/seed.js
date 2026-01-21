const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const users = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Rahul',
    email: 'rahul@demo.com',
    password: 'rahul123',
    role: 'instructor',
  },
  {
    name: 'Aisha',
    email: 'aisha@demo.com',
    password: 'aisha123',
    role: 'instructor',
  },
  {
    name: 'Om',
    email: 'om@demo.com',
    password: 'om123',
    role: 'instructor',
  },
  {
    name: 'Sara',
    email: 'sara@demo.com',
    password: 'sara123',
    role: 'instructor',
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    await User.deleteMany();

    const usersWithHash = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(user.password, salt);
      return { ...user, passwordHash };
    }));

    await User.insertMany(usersWithHash);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedDB();
