import axios from "axios";

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp',
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

class GuestService {
  // Obtener todos los invitados
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener un invitado por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar un nuevo invitado
  postGuest(data) {
    return apiClient.post("/add", data);
  }

  // Actualizar un invitado por ID
  putGuest(id, updatedGuestData) {
    return apiClient.put(`/update/${id}`, updatedGuestData);
  }

  // Eliminar un invitado
  deleteGuest(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

export default new GuestService(); // Exporta la instancia de la clase
