const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getTrustedSdk, handleError, serialize, getIntegrationSdk } = require('../api-util/sdk');

module.exports = (req, res) => {
  const { isSpeculative, bookingData, bodyParams, queryParams } = req.body;

  const listingId = bodyParams && bodyParams.params ? bodyParams.params.listingId : null;

  const sdk = getSdk(req, res);
  const intergrationSdk = getIntegrationSdk();
  let lineItems = null;
  let userId = null;

  sdk.currentUser
    .show()
    .then(res => {
      userId = res.data.data.id;
      return !res.data.data.attributes?.profile.metadata.firstTransactionId;
    })
    .then(isFirstBooking => {
      sdk.listings
        .show({ id: listingId })
        .then(listingResponse => {
          const listing = listingResponse.data.data;
          lineItems = transactionLineItems(listing, bookingData, isFirstBooking);

          return getTrustedSdk(req);
        })
        .then(trustedSdk => {
          const { params } = bodyParams;

          // Add lineItems to the body params
          const body = {
            ...bodyParams,
            params: {
              ...params,
              lineItems,
            },
          };

          if (isSpeculative) {
            return trustedSdk.transactions.initiateSpeculative(body, queryParams);
          }
          return trustedSdk.transactions.initiate(body, queryParams);
        })
        .then(apiResponse => {
          const { status, statusText, data } = apiResponse;
          if (!isSpeculative && isFirstBooking) {
            intergrationSdk.users.updateProfile({
              id: userId,
              metadata: {
                firstTransactionId: data.data.id.uuid,
              }
            }, {
              expand: true,
            });
          }
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
    });
};
