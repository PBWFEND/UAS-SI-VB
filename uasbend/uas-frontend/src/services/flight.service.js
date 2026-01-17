import api from "./api";

export const getFlights = async () => {
  const res = await api.get("/flights");
  return res.data;
};

export const createFlight = async (data) => {
  const res = await api.post("/flights", data);
  return res.data;
};

export const updateFlight = async (id, data) => {
  const res = await api.put(`/flights/${id}`, data);
  return res.data;
};

export const deleteFlight = async (id) => {
  const res = await api.delete(`/flights/${id}`);
  return res.data;
};
