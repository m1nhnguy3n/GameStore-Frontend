// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------

export function sendMailResetPasswordApi(email) {
  return axios.post('/auth/forgot-password/', {
    email,
  });
}

export function resetPasswordApi(password, tokenToReset) {
    return axios.post('/reset-password', { ...password, token: tokenToReset });
}

export function loginApi(email, password) {
  return axios.post('/auth/login', {
    email,
    password,
  });
}
export function registerApi(email, password, firstName, lastName) {
  return axios.post('/auth/register', {
    email,
    password,
    firstName,
    lastName,
  });
}

export function refreshApi(refreshToken) {
  return axios.post('/auth/refresh', {
    refreshToken,
  });
}


