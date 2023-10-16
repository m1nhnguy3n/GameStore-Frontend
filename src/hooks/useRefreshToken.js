import axios from '../utils/axios';

const useRefreshToken = () => {
  const refresh = async () => {
    const refreshTokenStored = window.localStorage.getItem('refreshToken');
    const response = await axios.post(
      '/auth/refresh',
      { refreshToken: refreshTokenStored },
    );

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
