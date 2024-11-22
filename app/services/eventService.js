import axios from "axios";

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/event',
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

class EventService {
  // Obtener todos los eventos
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener evento por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar un nuevo evento
  addEvent(data) {
    return apiClient.post("/add", data);
  }

  // Actualizar un evento existente (ID en la URL)
  updateEvent(id, updatedData) {
    return apiClient.put(`/update/${id}`, updatedData);
  }

  // Eliminar un evento
  deleteEvent(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

export default new EventService(); // Exporta la instancia de la clase
