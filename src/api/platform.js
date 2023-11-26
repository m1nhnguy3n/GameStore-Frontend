// utils
import axios from '../utils/axios';

export function addPlatformApi(platform) {
  return axios.post('/platform/', { ...platform });
}

export function getPlatformsApi() {
    return axios.get('/platform')
}

export function editPlatformApi(platform) {
    return axios.put(`/platform/${platform.id}`, platform)
}

export function deletePlatformApi(id) {
    return axios.delete(`/platform/${id}`)
}
