import axios from "axios";

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/equipment-type',
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

class EquipmentTypeService {
  // Obtener todos los tipos de equipos
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener tipo de equipo por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar un nuevo tipo de equipo
  postEquipmentType(data) {
    return apiClient.post("/add", data);
  }

  // Actualizar tipo de equipo por ID
  updateById(id, data) {
    return apiClient.put(`/update/${id}`, data);
  }
}

export default new EquipmentTypeService(); // Exporta la instancia de la clase
