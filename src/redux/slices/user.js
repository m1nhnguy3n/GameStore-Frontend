import { createSlice } from '@reduxjs/toolkit';

// api
import { getInvoicesApi, getUsersApi, getInvoiceForAdminApi } from '../../api/user';

//
import { dispatch } from '../store';
import { getListCardsApi } from '../../api/stripe';

const initialState = {
  isLoading: false,
  error: null,
  users: [],
  invoices: [],
  invoicesForAdmin:[],
  cards: null,
  user: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET users
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // GET USER
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },

    getCardsSuccess(state, action) {
      state.isLoading = false;
      state.cards = action.payload;
    },

    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },

    getInvoicesForAdminSuccess(state, action) {
      state.isLoading = false;
      state.invoicesForAdmin = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getUsersApi();
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListCards(stripeCustomerId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getListCardsApi(stripeCustomerId);
      dispatch(slice.actions.getCardsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListInvoices(userId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getInvoicesApi(userId);
      dispatch(slice.actions.getInvoicesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListInvoicesForAdmin() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getInvoiceForAdminApi();
      dispatch(slice.actions.getInvoicesForAdminSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}