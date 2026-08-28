import axios from 'axios';

// RENDER URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const getCapsules = () => 
  axios.get(`${API_BASE}/capsules`).then(res => res.data);

export const createCapsule = (data) => 
  axios.post(`${API_BASE}/capsules`, data).then(res => res.data);

export const updateCapsule = (id, data) => 
  axios.put(`${API_BASE}/capsules/${id}`, data).then(res => res.data);

export const deleteCapsule = (id) => 
  axios.delete(`${API_BASE}/capsules/${id}`);