const { handleError, serialize, getIntegrationSdk } = require('../api-util/sdk');

module.exports = (req, res) => {
  const { id, customer } = req.body;
  const customerId = customer.id;
  const firstTransaction = customer.attributes.profile.metadata.firstTransactionId;
  const integrationSdk = getIntegrationSdk();

  integrationSdk.users.updateProfile({
    id: customerId,
    metadata: {
      firstTransactionId: id === firstTransaction ? null : firstTransaction,
    }
  }, {
    expand: true,
  })
  .then(response => {
    const { status, statusText, data } = response;

    res
      .status(status)
      .set('Content-Type', 'application/transit+json')
      .send(
        serialize({
          status,
          statusText,
          data,
        })
      )
      .end();
  })
  .catch(e => {
    handleError(res, e);
  });
}