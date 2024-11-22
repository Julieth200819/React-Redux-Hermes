import axios from "axios";

// Crea una instancia de Axios con una URL base
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1/hermesapp/view',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configura el interceptor para agregar el token de autorización y el documento de usuario a cada solicitud
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {  // Verifica que esté en el lado del cliente
    const token = localStorage.getItem("token");
    const document = localStorage.getItem("userDocument");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (document) {
      config.url = `${config.url}/card/${document}`;  // Agrega el documento al URL
    }
  }
  return config;
}, (error) => {
  // Manejo de errores en la solicitud
  return Promise.reject(error);
});

class CardService {
  // Obtener todos los datos de la persona
  getAll() {
    return apiClient.get("");  // Deja la URL vacía ya que el interceptor añade el endpoint y documento
  }
}

export default new CardService();
