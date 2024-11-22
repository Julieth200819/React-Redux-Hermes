import axios from "axios";

// Crea una instancia de Axios con una URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/headquarter',
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

class HeadquarterService {
  // Obtener todas las Sedes
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener una sede por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar una nueva sede
  addHeadquarter(data) {
    return apiClient.post("/add", data);
  }

  // Actualizar una sede
  updateHeadquarter(id, updatedData) {
    return apiClient.put(`/update/${id}`, updatedData);
  }

  // Eliminar una sede
  deleteHeadquarter(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

// Exporta la clase para ser instanciada
export default new HeadquarterService();
