import axios from 'axios';

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/journey',
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

class JourneyService {
  // Obtener todas las jornadas
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener jornada por ID
  getById(id) {
    return apiClient.get(`/find/${id}`);
  }

  // Agregar una nueva jornada
  postJourney(data) {
    return apiClient.post("/add", data);
  }

  // Agregar múltiples jornadas
  postJourneyMassive(data) {
    return apiClient.post("/addMassive", data);
  }

  // Actualizar una jornada
  putJourney(id, updatedJourneyData) {
    return apiClient.put(`/update/${id}`, updatedJourneyData);
  }

  // Eliminar una jornada por ID
  deleteJourney(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

export default new JourneyService(); // Exporta la instancia de la clase
