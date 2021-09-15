const { getTrustedSdk, handleError, serialize, getIntegrationSdk } = require('../api-util/sdk');

module.exports = (req, res) => {
  const now = new Date();
  const { transaction } = req.body;
  const { customer, id } = transaction;
  const { lastTransition, createdAt } = transaction.attributes;
  const firstTransaction = customer.attributes.profile.metadata.firstTransactionId;

  const intergrationSdk = getIntegrationSdk();
  const timeGap = Math.abs((createdAt - now) / (1000 * 60 * 60 * 24));
  let nextTransition = null;

  if (lastTransition === 'transition/accept' && timeGap <= 2) {
    nextTransition = 'transition/cancel-by-customer-after-accepted-with-refund';
  } else if (lastTransition === 'transition/accept') {
    nextTransition = 'transition/cancel-by-customer-after-accepted';
  } else if (timeGap <= 2) {
    nextTransition = 'transition/cancel-by-customer-before-accepted-with-refund';
  } else {
    nextTransition = 'transition/cancel-by-customer-before-accepted';
  }

  console.log(lastTransition, nextTransition);

  intergrationSdk.users.updateProfile({
    id: customer.id,
    metadata: {
      firstTransactionId: id.uuid === firstTransaction ? null : firstTransaction,
    }
  }, {
    expand: true,
  }).then(() => {
    return getTrustedSdk(req);
  }).then(sdk => {
    sdk.transactions.transition({
      id: id,
      transition: nextTransition,
      params: {},
    }, {
      expand: true,
    }).then(apiRes => {
      const { status, statusText, data } = apiRes;
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
    }).catch(e => {
      handleError(res, e);
    });
  })

  // const cancelTransition = 

  // const listingId = bodyParams && bodyParams.params ? bodyParams.params.listingId : null;

  // const sdk = getSdk(req, res);
  // let lineItems = null;
  // let userId = null;
};
