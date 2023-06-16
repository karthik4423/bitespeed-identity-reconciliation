const services = require('../services/index');
const controllerFunctions = {
  handleIdentify: async (req) => {
    return services.reconcileAccounts({ phone: req.body.phoneNumber, email: req.body.email });
  }
};

module.exports = controllerFunctions;
