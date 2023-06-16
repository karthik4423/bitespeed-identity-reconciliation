const services = require('../services/index');
const controllerFunctions = {
  handleIdentify: async (req) => services.reconcileAccounts()
};

module.exports = controllerFunctions;
