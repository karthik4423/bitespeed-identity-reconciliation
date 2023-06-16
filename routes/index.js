const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');

router.post('/identify', async (req, res) => {
  try {
    const response = await controller.handleIdentify(req);
    return res.status(response?.status || 200).send({ msg: 'Success', response });
  } catch (err) {
    console.log(err, Object.keys(err));
    return res.status(err.status || 500).send({ msg: err.message, response: err });
  }
});
module.exports = router;
