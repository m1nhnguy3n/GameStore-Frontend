// utils
import axios from '../utils/axios';

export function addCategoryApi(category) {
  return axios.post('/category/', {...category});
}

export function editCategoryApi(category) {
    return axios.put(`/category/${category.id}`, { ...category });
}
export function deleteCategoryApi(id) {
  return axios.delete(`/category/${id}`);
}

export function getCategoriesApi() {
    return axios.get('/category/')
}