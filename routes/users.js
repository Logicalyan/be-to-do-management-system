var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { stringify } = require('jade/lib/utils');

//Get All Users
router.get('/get-all', async function (req, res) {
  const users = await prisma.user.findMany({
    where: {
      is_deleted: false,
    },
  });

  if (users.length === 0 || users === null || users === undefined) {
    res.status(404).json({
      status: 'error',
      message: 'Users Not Found',
    });
  } else {
    res.json({
      status: 'success',
      data: users,
    });
  }
});

//Get User By id
router.get('/get/:id', async function (req, res) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (user === null || user === undefined) {
    res.status(404).json({
      status: 'error',
      message: `User with id ${id} not found`,
    });
  } else {
    res.json({
      status: 'success',
      data: user,
    });
  }
});

// Create User
router.post('/create', async function (req, res) {
  const { name, email, password } = req.body;

  name === null
    ? res.status(404).json({
        status: 'error',
        message: 'name fields are required',
      })
    : email === null
      ? res.status(404).json({
          status: 'error',
          message: 'email fields are required',
        })
      : password === null
        ? res.status(404).json({
            status: 'error',
            message: 'password fields are required',
          })
        : async () => {
            const hashPassword = await bcrypt.hash(password, 10);
            const stringPassword = await stringify(hashPassword);
            const user = await prisma.user.create({
              data: {
                username: name,
                email,
                password: stringPassword,
              },
            });
            res.send(user);
          };
});

// Update User
router.put('/update/:id', async function (req, res) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const stringPassword = await stringify(hashPassword);

  if (name === '' && email === '' && password === '') {
    res.status(404).json({
      status: 'error',
      message: 'All fields are required',
    });
  }
  if (name === '') {
    res.status(404).json({
      status: 'error',
      message: 'name fields are required',
    });
  } else if (email === '') {
    res.status(404).json({
      status: 'error',
      message: 'email fields are required',
    });
  } else if (password === '') {
    res.status(404).json({
      status: 'error',
      message: 'password fields are required',
    });
  } else {
    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username: name,
        email,
        password: stringPassword,
      },
    });
    res.json({
      status: 'success',
      data: user,
    });
  }
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
  const { id } = req.params;
  const user_exist = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (user_exist === null || user_exist === undefined) {
    res.status(404).json({
      status: 'error',
      message: `User with id ${id} not found`,
    });
  } else {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.send(user);
  }
});

//Soft Delete User
router.delete('/soft-delete/:id', async function (req, res) {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      deleted_at: new Date(),
      is_deleted: true,
    },
  });
  res.send(user);
});

module.exports = router;
