const managers = require('../managers/index');
const serviceFunctions = {
  reconcileAccounts: async () => managers.getContacts({ phone: null, email: null })
};

module.exports = serviceFunctions;
