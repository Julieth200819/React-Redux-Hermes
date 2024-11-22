import axios from 'axios';

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/program',
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

class ProgramService {
  // Obtener todos los programas
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener programa por ID
  getById(id) {
    return apiClient.get(`/find/${id}`);
  }

  // Agregar un nuevo programa
  postProgram(data) {
    return apiClient.post("/add", data);
  }

  // Agregar múltiples programas
  postProgramMassive() {
    return apiClient.post("/addMassive");
  }

  // Actualizar un programa
  putProgram(id, updatedProgramData) {
    return apiClient.put(`/update/${id}`, updatedProgramData);
  }

  // Eliminar un programa por ID
  deleteProgram(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

export default new ProgramService(); // Exporta la instancia de la clase
