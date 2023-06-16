const moment = require('moment');
const managers = require('../managers/index');
const serializers = require('../serializers');

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
const createContactModel = ({ currentTimeStamp, linkPrecedence, linkedId, email, phone }) => {
  return {
    phoneNumber: phone,
    email,
    linkedId,
    linkPrecedence,
    createdAt: currentTimeStamp,
    updatedAt: currentTimeStamp,
    deletedAt: 'NULL'
  };
};

const serviceFunctions = {
  reconcileAccounts: async ({ email = null, phone = null }) => {
    try {
      // Validate the input
      validateInput({ phone, email });

      const contactDetails = await managers.getContactsByPhoneAndEmail({ phone, email });

      // If no contact details are fetched, add a new contact entry to the table
      if (!contactDetails.length) {
        const model = createContactModel({
          currentTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          linkPrecedence: 'primary',
          linkedId: null,
          email,
          phone
        });
        const contactId = await managers.createContacts({ model });
        return serializers.identityReconciliation({
          contacts: [model],
          primaryContactId: contactId
        });
      }

      // Format the query result to decide how to reconcile the contacts
      let isANewEmail = true;
      let isANewPhone = true;
      const contactIdsToMarkAsSecondary = [];
      contactDetails.forEach((contact, index) => {
        if (contact.email === email) {
          isANewEmail = false;
        }
        if (parseInt(contact.phoneNumber, 10) === phone) {
          isANewPhone = false;
        }
        if (
          index &&
          (contact.linkPrecedence === 'primary' ||
            contact.linkedId !== (contactDetails[0].linkedId || contactDetails[0].id))
        ) {
          contactIdsToMarkAsSecondary.push(contact.id);
        }
      });
      // If the request has a new phone or email, create a new secondary contact
      let createSecondaryContactResult = 0;
      let secondaryContactModel = {};
      if (isANewEmail || isANewPhone) {
        secondaryContactModel = createContactModel({
          currentTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
          linkPrecedence: 'secondary',
          linkedId: contactDetails[0].linkedId || contactDetails[0].id,
          email,
          phone
        });
        createSecondaryContactResult = await managers.createContacts({
          model: secondaryContactModel
        });
      }

      // Update any primary contact that can be linked to this
      let linkedContactsOfSecondaryContacts = [];
      if (contactIdsToMarkAsSecondary.length) {
        linkedContactsOfSecondaryContacts = await managers.getContactsByLinkedId({
          linkedId: contactIdsToMarkAsSecondary
        });
        const contactIdsToUpdate = [
          ...linkedContactsOfSecondaryContacts.map((contact) => contact.id),
          ...contactIdsToMarkAsSecondary
        ];
        await managers.updateContacts({
          ids: contactIdsToUpdate,
          model: {
            linkPrecedence: 'secondary',
            linkedId: contactDetails[0].linkedId || contactDetails[0].id
          }
        });
      }

      // Fetch all the secondary contacts with the same linkedId that doesn't have the matching email or phone
      const allLinkedContactsOfPrimaryContact = await managers.getContactsByLinkedId({
        linkedId: contactDetails[0].linkedId || contactDetails[0].id
      });
      if (createSecondaryContactResult) {
        linkedContactsOfSecondaryContacts.push({
          ...secondaryContactModel,
          id: createSecondaryContactResult
        });
      }
      const availableContacts = [
        ...allLinkedContactsOfPrimaryContact,
        ...contactDetails,
        ...(linkedContactsOfSecondaryContacts.length ? linkedContactsOfSecondaryContacts : [])
      ];

      // Will fetch the primary contact's details if it isn't already available with us
      const isPrimaryContactAvailable = availableContacts.map(
        (contact) => contact.id === contactDetails[0].linkedId
      ).length;
      return serializers.identityReconciliation({
        contacts: [
          ...availableContacts,
          ...(isPrimaryContactAvailable
            ? await managers.getContactsById({
                id: contactDetails[0].linkedId || contactDetails[0].id
              })
            : [])
        ],
        primaryContactId: contactDetails[0].linkedId || contactDetails[0].id
      });
    } catch (err) {
      throw err;
    }
  }
};

module.exports = serviceFunctions;
