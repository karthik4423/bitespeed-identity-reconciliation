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
  getContactsByPhoneAndEmail: async ({ phone, email }) => {
    let queryString = `SELECT * FROM CONTACT`;
    if (phone || email) {
      queryString += ` WHERE ${phone ? `phoneNumber = ${phone}` : ``} ${
        phone && email ? ` OR ` : ``
      } ${email ? `email = '${email}'` : ``}`;
    }
    queryString += ` ORDER BY createdAt;`;
    const result = await dbQuery(queryString);
    return result;
  },
  getContactsById: async ({ id }) => {
    let queryString = `SELECT * FROM CONTACT WHERE id IN (${id});`;
    const result = await dbQuery(queryString);
    return result;
  },
  getContactsByLinkedId: async ({ linkedId }) => {
    let queryString = `SELECT * FROM CONTACT WHERE linkedId IN (${linkedId});`;
    const result = await dbQuery(queryString);
    return result;
  },
  createContacts: async ({ model }) => {
    const queryString = `INSERT INTO CONTACT (${contactTableKeyNames.join(',')}) VALUES (${
      model.phoneNumber || 'NULL'
    }, ${model.email ? `'${model.email}'` : 'NULL'}, ${model.linkedId}, '${
      model.linkPrecedence
    }', '${model.createdAt}', '${model.updatedAt}', ${model.deletedAt});`;
    const result = await dbQuery(queryString);
    return result.insertId;
  },
  updateContacts: async ({ ids, model }) => {
    const queryString = `UPDATE CONTACT SET ${Object.keys(model).map(
      (key) => `${key} = ${typeof model[key] === 'string' ? `'${model[key]}'` : `${model[key]}`}`
    )} WHERE id IN (${ids});`;
    await dbQuery(queryString);
  }
};

module.exports = managerFunctions;
