// utils
import axios from '../utils/axios';

export function deleteProduct(id) {
    return axios.delete(`/product/${id}`)
}

export function editProduct(product) {
    return axios.put(`/product/${product.id}`, product)
}
