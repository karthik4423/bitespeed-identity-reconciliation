const express = require('express');
const router = express.Router();
const serializer = require('../serializers/index');
const controller = require('../controllers/index');

router.post('/identify', async (req, res) => {
  const response = serializer.identityReconciliation(await controller.handleIdentify(req));
  return res.status(200).send({});
});
module.exports = router;
