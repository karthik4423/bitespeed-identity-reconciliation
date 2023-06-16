const dbQuery = require('../sqlRepository/db');

const contactTableKeyNames = [
  'phoneNumber',
  'email',
  'linkedId',
  'linkPrecedence',
  'createdAt',
  'updatedAt',
  'deletedAt'
];
const managerFunctions = {
  getContacts: async ({ phone, email }) => {
    let queryString = `SELECT * FROM CONTACT`;
    if (phone || email) {
      queryString += ` WHERE ${phone ? `phoneNumber = ${phone}` : ``} ${
        phone && email ? ` OR ` : ``
      } ${email ? `email = ${email}` : ``}`;
    }
    queryString += ` ORDER BY createdAt;`;
    const result = await dbQuery(queryString);
    return result;
  },
  createContacts: async ({ model }) => {
    const queryString = `INSERT INTO CONTACT (${contactTableKeyNames.join(',')}) VALUES (${
      model.phoneNumber || 'null'
    }, ${model.email || 'null'}, ${model.linkedId}, "${model.linkPrecedence}", "${
      model.createdAt
    }", "${model.updatedAt}", ${model.deletedAt});`;
    await dbQuery(queryString);
  }
};

module.exports = managerFunctions;
