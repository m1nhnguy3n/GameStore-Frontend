import jwtDecode from 'jwt-decode';
//
import axios from './axios';

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  // ----------------------------------------------------------------------

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};


// ----------------------------------------------------------------------

const setAccessToken = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

export { isValidToken, setAccessToken, setRefreshToken };
