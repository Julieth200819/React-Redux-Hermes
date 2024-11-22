import axios from 'axios';

// Crea una instancia de Axios con la URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/person',
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

class PeopleService {
  // Obtener todos las personas
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener persona por ID
  getById(id) {
    return apiClient.get(`/by-id/${id}`);
  }

  // Agregar una nueva persona
  postPerson(people) {
    return apiClient.post("/add", people);
  }

  // Agregar múltiples personas
  postPersonMassive(people) {
    return apiClient.post("/addMassive", people);
  }

  // Actualizar una persona
  putPerson(id, updatedPersonData) {
    return apiClient.put(`/update/${id}`, updatedPersonData);
  }

  // Eliminar una persona por ID
  deletePerson(id) {
    return apiClient.delete(`/delete/${id}`);
  }

  // Obtener persona por número de documento
  getPersonByDocument(documentNumber) {
    return apiClient.get(`/findDocument/${documentNumber}`);
  }
}

export default new PeopleService(); // Exporta la instancia de la clase
