// src/api/idCards.js
import api from './axios';

export const fetchIdCards = () => {
  return api.get('/id-cards');
};

export const approveIdCard = (id) => {
  return api.patch(`/id-cards/${id}/approve`);
};
