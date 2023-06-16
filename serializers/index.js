const removeDuplicates = (arr) => [...new Set(arr)];
const serializerFunctions = {
  identityReconciliation: ({ contacts, primaryContactId = null }) => {
    const formattedResponse = {
      primaryContactId,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: []
    };

    contacts.forEach((contact) => {
      if (contact.linkPrecedence === 'primary') {
        if (!formattedResponse.primaryContactId) {
          formattedResponse.primaryContactId = contact.id;
        }
        formattedResponse.emails.unshift(contact.email);
        formattedResponse.phoneNumbers.unshift(parseInt(contact.phoneNumber, 10));
      } else {
        formattedResponse.emails.push(contact.email);
        formattedResponse.phoneNumbers.push(contact.phoneNumber);
      }
      if (contact.id) {
        formattedResponse.secondaryContactIds.push(contact.id);
      }
    });
    if (!formattedResponse.primaryContactId) {
      formattedResponse.primaryContactId = contacts[0].linkedId;
    }

    formattedResponse.emails = removeDuplicates(formattedResponse.emails);
    formattedResponse.phoneNumbers = removeDuplicates(formattedResponse.phoneNumbers);
    formattedResponse.secondaryContactIds = removeDuplicates(
      formattedResponse.secondaryContactIds
    ).filter((id) => id !== formattedResponse.primaryContactId);

    return {
      contact: formattedResponse
    };
  }
};

module.exports = serializerFunctions;
