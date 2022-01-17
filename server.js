const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const json = require('body-parser');
const JWT_SECRET = 'kajbdjhvajhb2342j3hbjhnmcz2@#$%$asdasa';

mongoose
  .connect(
    'mongodb+srv://vineet:vineet@cluster0.jpwfd.mongodb.net/movie-library?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('DB Connection Successfull'))
  .catch((err) => {
    console.error(err);
  });

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

//REGISTER START

// app.post('/api/register', async (req, res) => {
//   console.log(req.body);

//   const { name, email, password: plainTextPassword } = req.body;
//   const password = await bcrypt.hash(plainTextPassword, 10);

//   try {
//     const response = await User.create({
//       name,
//       email,
//       password,
//     });
//     console.log('User created successfully: ', response);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.json({ status: 'error', error: 'Email Already Registered' });
//     }
//     console.log(error.data);
//     throw error;
//   }

//   res.json({ status: 'ok' });
// });

//REGISTER END

app.post('/api/register ', async (req, res) => {
  console.log(req.body);
  const { name, email, password: plainTextPassword } = req.body;

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      name,
      email,
      password,
    });
    console.log('User created successfully: ', response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: 'error', error: 'Username already in use' });
    }
    console.log(error);
    throw error;
  }

  res.json({ status: 'ok' });
});

// LOGIN START

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid Username/Password' });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET
    );

    return res.json({ status: 'ok', data: token });
  }
  res.json({ status: 'error', error: 'Invalid username/password' });
});

//LOGIN END

app.listen(3000, () => {
  console.log('Server running at 3000 ');
});
