const moment = require('moment');
const managers = require('../managers/index');

const validateInput = ({ email, phone }) => {
  if (email === null && phone === null) {
    // Both parameters cannot be null
    throw {
      message: 'Email and Phone Number cannot be null, at least one should be present',
      status: 400
    };
  }
  if (email && email.length === 0) {
    // TODO : validate the structure of email itself
    throw {
      message: 'Email cannot be empty',
      status: 400
    };
  }
  if (phone !== null && phone < 10000) {
    // Expecting a phone number that is greater than 9999
    throw {
      message: 'Invalid phone number',
      status: 400
    };
  }
};

const serviceFunctions = {
  reconcileAccounts: async ({ email = null, phone = null }) => {
    try {
      // Validate the input
      validateInput({ phone, email });

      const contactDetails = await managers.getContacts({ phone, email });

      // If no contact details are fetched, add a new contact entry to the table
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

      if (!contactDetails.length) {
        const model = {
          phoneNumber: phone,
          email,
          linkedId: null,
          linkPrecedence: 'primary',
          createdAt: currentTime,
          updatedAt: currentTime,
          deletedAt: null
        };
        await managers.createContacts({ model });
        return {
          status: 201,
          message: 'New contact created'
        };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};

module.exports = serviceFunctions;
