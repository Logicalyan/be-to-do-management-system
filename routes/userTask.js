var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const bcrypt = require('bcrypt');
// const { stringify } = require('jade/lib/utils');

//Get User Task
router.get('/get-all', async function (req, res) {
  const userTask = await prisma.userTask.findMany();
  res.send(userTask);
});

//Get User Task By Id
router.get('/get-user-task/:user_id/:task_id', async function (req, res) {
  const { user_id, task_id } = req.params;
  const userTask = await prisma.userTask.findUnique({
    where: {
      user_id_task_id: {
        user_id: parseInt(user_id),
        task_id: parseInt(task_id),
      },
    },
  });
  res.json(userTask);
});

//Create User Task
router.post('/create', async function (req, res) {
  const { user_id, task_id } = req.body;
  const userTask = await prisma.userTask.create({
    data: {
      user_id,
      task_id,
    },
  });
  res.send(userTask);
});

//Delete User Task
router.delete('/delete/:id', async function (req, res) {
  const { id } = req.params;
  const userTask = await prisma.userTask.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.send(userTask);
});

//Soft Delete User Task
router.delete('/soft-delete/:id', async function (req, res) {
  const { id } = req.params;
  const userTask = await prisma.userTask.update({
    where: {
      id: parseInt(id),
    },
    data: {
      deleted_at: new Date(),
      is_deleted: true,
    },
  });
  res.send(userTask);
});

module.exports = router;
