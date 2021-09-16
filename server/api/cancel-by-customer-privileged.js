const { getTrustedSdk, handleError, serialize, getIntegrationSdk } = require('../api-util/sdk');
const { TRANSITION_ACCEPT, TRANSITION_CANCEL_BY_CUSTOMER_AFTER_ACCEPTED_WITH_REFUND, TRANSITION_CANCEL_BY_CUSTOMER_AFTER_ACCEPTED, TRANSITION_CANCEL_BY_CUSTOMER_BEFORE_ACCEPTED_WITH_REFUND, TRANSITION_CANCEL_BY_CUSTOMER_BEFORE_ACCEPTED } = require('../api-util/transaction');

module.exports = (req, res) => {
  const now = new Date();
  const { transaction } = req.body;
  const { customer, id } = transaction;
  const { lastTransition, createdAt } = transaction.attributes;
  const firstTransaction = customer.attributes.profile.metadata.firstTransactionId;

  const intergrationSdk = getIntegrationSdk();
  const timeGap = Math.abs((createdAt - now) / (1000 * 60 * 60 * 24));
  let nextTransition = null;

  if (lastTransition === TRANSITION_ACCEPT && timeGap <= 2) {
    nextTransition = TRANSITION_CANCEL_BY_CUSTOMER_AFTER_ACCEPTED_WITH_REFUND;
  } else if (lastTransition === 'transition/accept') {
    nextTransition = TRANSITION_CANCEL_BY_CUSTOMER_AFTER_ACCEPTED;
  } else if (timeGap <= 2) {
    nextTransition = TRANSITION_CANCEL_BY_CUSTOMER_BEFORE_ACCEPTED_WITH_REFUND;
  } else {
    nextTransition = TRANSITION_CANCEL_BY_CUSTOMER_BEFORE_ACCEPTED;
  };

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
  });
};
