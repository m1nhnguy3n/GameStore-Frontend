// utils
import axios from '../utils/axios';

export function editUserApi(userId, user) {
  return axios.put('/user/update-user/', user);
}

export function getUsersApi() {
  return axios.get('/user/users');
}

export function getInvoicesApi(userId) {
  return axios.get(`/invoice/user/${userId}`)
}

export function createInvoiceApi(invoice) {
  return axios.post('/invoice/create/',invoice)
}

export function createUserApi(user) {
  return axios.post('/user/create', user)
}

export function getInvoiceForAdminApi() {
  return axios.get('/invoice/invoices')
}

export function deleteOneUser(userId) {
  return axios.delete(`user/${userId}`)
}