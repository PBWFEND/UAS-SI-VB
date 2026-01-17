const BASE_URL = 'http://localhost:3000/api';

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const register = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
};

export const getTasks = async (token) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: { Authorization: token }
  });
  return res.json();
};

export const createTask = async (token, data) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateTask = async (token, id, data) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteTask = async (token, id) => {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token }
  });
};

export const getProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/users/profile`, {
    headers: { Authorization: token }
  });
  return res.json();
};