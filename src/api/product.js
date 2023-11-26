// utils
import axios from '../utils/axios';

export function deleteProduct(id) {
    return axios.delete(`/product/${id}`)
}

export function editProductApi(product) {
    return axios.put(`/product/${product.id}`, product)
}
export function addProductApi(product) {
  return axios.post(`/product`, product);
}

export function getProductsApi() {
    return axios.get('/product/')
}

export function searchProductByNameApi(productName) {
  return axios.get(`/product/search/${productName}`);
}

export function addReviewApi(review) {
    return axios.post('/review/create', review)
}

export function addCdkeyApi(cdkey) {
    return axios.post(`/cdkey/${cdkey.productId}`, cdkey)
}

export function getStockStatusesApi() {
    return axios.get('/stock-status/')
}