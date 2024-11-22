import axios from "axios";

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/entrance',
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

class EntranceService {

  // Obtener todas las entradas
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener entrada por ID
  getById(id) {
    return apiClient.get(`/find/${id}`);
  }

  // Agregar una nueva entrada
  postEntrance(data) {
    return apiClient.post("/add", data);
  }

  // Actualizar entrada
  putEntrance(id, updatedEntranceData) {
    return apiClient.put(`/update/${id}`, updatedEntranceData);
  }

  // Eliminar entrada
  deleteEntrance(id) {
    return apiClient.delete(`/delete/${id}`);
  }

  // Exportar PDF
  exportPDF() {
    return apiClient.get("/export/pdf");
  }
}

export default new EntranceService();
