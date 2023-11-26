// api
import { refreshApi } from '../api/auth';

const useRefreshToken = () => {
  const refresh = async () => {
    const refreshTokenStored = window.localStorage.getItem('refreshToken');
    const response = await refreshApi(refreshTokenStored);

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
