/* eslint-disable prefer-arrow-callback */
// utils
import axios from '../../utils/axios';
//

// ----------------------------------------------------------------------

export function sendMailResetPassword(email) {
  return axios.post('/auth/forgot-password/', {
    email,
  });
}
