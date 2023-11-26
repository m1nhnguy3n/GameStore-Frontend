// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------

export function attachCardApi(paymentMethodId, stripeCustomerId) {
  return axios.post('/stripe/attach-card', {
    paymentMethodId,
    stripeCustomerId,
  });
}

export function chargeApi(paymentMethodId, stripeCustomerId, total) {
  return axios.post('/stripe/charge', { paymentMethodId, stripeCustomerId, total });
}

export function getListCardsApi(stripeCustomerId) {
  return axios.get(`/stripe/list-cards/${stripeCustomerId}`);
}
