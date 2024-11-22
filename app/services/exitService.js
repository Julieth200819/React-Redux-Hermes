import axios from "axios";

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/exit',
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

class ExitService {

  // Obtener todos los exits
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener exit por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar un nuevo exit
  postExit(data) {
    return apiClient.post("/add", data);
  }

  // Agregar varios exits (Massive)
  postExitMassive(exit) {
    return apiClient.post("/addMassive", exit);
  }

  // Actualizar un exit por ID
  putExit(id, updatedExitData) {
    return apiClient.put(`/update/${id}`, updatedExitData);
  }

  // Eliminar un exit
  deleteExit(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

export default new ExitService(); // Exporta la instancia de la clase
