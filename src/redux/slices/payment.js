// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export function attachCard(paymentMethodId) {
  return axios.post('/credit-cards', {
    paymentMethodId,
  });
}

export function charge(paymentMethodId, total) {
  return axios.post('/credit-cards', {
    paymentMethodId,
    total,
  });
}