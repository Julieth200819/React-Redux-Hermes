import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/coordination',
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

class CoordinationService {
  getAll() {
    return apiClient.get("/all");
  }

  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  postCoordination(data) {
    return apiClient.post("/add", data);
  }

  putStudyCoordination(id, updatedCoordination) {
    return apiClient.put(`/update/${id}`, updatedCoordination);
  }

  deleteCoordination(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

export default new CoordinationService();