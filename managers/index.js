const dbQuery = require('../sqlRepository/db');
const managerFunctions = {
  getContacts: async ({ phone, email }) => {
    const queryString = 'SELECT * FROM CONTACT;';
    const result = await dbQuery(queryString);
    return result;
  },
  updateContacts: async () => {}
};

module.exports = managerFunctions;
