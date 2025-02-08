var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const bcrypt = require('bcrypt');
// const { stringify } = require('jade/lib/utils');

/* GET users listing. */
router.get('/get-all', async function (req, res) {
  const tasks = await prisma.task.findMany();
  res.send(tasks);
});

router.get('/get/:id', async function (req, res) {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
  });

  res.json(task);
});

router.post('/create', async function (req, res) {
  const { title, desc, priority, created_by, deadline, is_done } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      desc,
      priority,
      created_by,
      deadline,
      is_done,
    },
  });

  res.send(task);
});

//Update Task
router.put('/update/:id', async function (req, res) {
  const { id } = req.params;
  const { title, desc, priority, created_by, deadline, is_done } = req.body;

  const task = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title,
      desc,
      priority,
      created_by,
      deadline,
      is_done,
    },
  });

  res.send(task);
});

// Delete Task
router.delete('/delete/:id', async function (req, res) {
  const { id } = req.params;
  const task = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.send(task);
});

// Soft Delete Task
router.delete('/soft-delete/:id', async function (req, res) {
  const { id } = req.params;
  const task = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      deleted_at: new Date(),
      is_deleted: true,
    },
  });
  res.send(task);
});

module.exports = router;
