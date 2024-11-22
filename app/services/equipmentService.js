import axios from 'axios';

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/equipment',
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

class EquipmentService {
  // Obtener todos los equipos
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener equipo por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar un nuevo equipo
  postEquipment(data) {
    return apiClient.post("/add", data);
  }

  // Actualizar un equipo por ID
  updateById(id, data) {
    return apiClient.put(`/update/${id}`, data);
  }

  updateEquipment(id, data) {
    return apiClient.put(`/update/${id}`, data);
  }

  // Obtener equipo por persona
  getEquipmentByPerson(personID) {
    return apiClient.get(`/by-person/${personID}`);
  }

  // Obtener datos de personas
  fetchPeopleData() {
    return apiClient.get('http://localhost:8081/api/v1/hermesapp/people');
  }
}

export default new EquipmentService(); 