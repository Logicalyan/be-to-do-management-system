var express = require('express');
var router = express.Router();

//Greetig API
router.get('/', function (req, res) {
  res.send('Selamat Datang');
});

module.exports = router;
