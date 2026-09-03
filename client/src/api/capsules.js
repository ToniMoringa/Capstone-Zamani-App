import api from './client';

export const getCapsules = (params) =>
  api.get('/capsules/', { params }).then((res) => res.data);

export const getMyCapsules = () =>
  api.get('/capsules/mine').then((res) => res.data);

export const createCapsule = (data) =>
  api.post('/capsules/', data).then((res) => res.data);

export const updateCapsule = (id, data) =>
  api.put(`/capsules/${id}`, data).then((res) => res.data);

export const deleteCapsule = (id) =>
  api.delete(`/capsules/${id}`);