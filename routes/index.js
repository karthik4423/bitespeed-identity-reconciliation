const express = require('express');
const router = express.Router();
const serializer = require('../serializers/index');
const controller = require('../controllers/index');

router.post('/identify', async (req, res) => {
  try {
    const response = serializer.identityReconciliation(await controller.handleIdentify(req));
    return res.status(200).send({ msg: 'Success', response });
  } catch (err) {
    return res.status(err.status).send({ msg: err.message, response: err });
  }
});
module.exports = router;
