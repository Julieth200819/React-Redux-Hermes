import axios from "axios";

// Crea una instancia de Axios con una URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/training_center',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configura el interceptor para agregar el token de autorización a cada solicitud
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {  // Verifica que esté en el lado del cliente
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  // Manejo de errores en la solicitud
  return Promise.reject(error);
});

class TrainingCentersService {
  // Obtener todos los centros de formación
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener centro de formación por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar un nuevo centro de formación
  postTrainingCenter(data) {
    return apiClient.post("/add", data);
  }

  // Actualizar un centro de formación
  putTrainingCenter(id, updatedTrainingCenterData) {
    return apiClient.put(`/update/${id}`, updatedTrainingCenterData);
  }

  // Eliminar un centro de formación
  deleteTrainingCenter(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

// Exporta la clase para ser instanciada
export default new TrainingCentersService();
