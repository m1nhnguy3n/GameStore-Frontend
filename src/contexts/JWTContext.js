import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
// hooks
import useAxiosPrivate from '../hooks/useAxiosPrivate';
// utils
import axios from '../utils/axios';
import { setAccessToken, setRefreshToken } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (!accessToken) {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }

        if (accessToken) {
          setAccessToken(accessToken);

          const response = await axiosPrivate.get('/auth/me');
          const user = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });
    const { accessToken, user, refreshToken } = response.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user, refreshToken } = response.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setAccessToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  const refresh = async () => {
    try {
      const refreshTokenStored = window.localStorage.getItem('refreshToken');
      const res = axios
        .post('/auth/refresh', {
          refreshToken: refreshTokenStored,
        })
        .then((token) => token.data.accessToken);
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
