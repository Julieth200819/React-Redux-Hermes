import axios from "axios";

// Crea una instancia de Axios con una URL base
const apiClient = axios.create({
  baseURL: "http://localhost:8081/api/v1/hermesapp/teacher",
});

// Configura el interceptor para agregar el token de autorización a cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") { // Verifica que esté en el lado del cliente
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Manejo de errores en la solicitud
    return Promise.reject(error);
  }
);

class TeacherService {
  // Obtener todos los instructores
  getAll() {
    return apiClient.get("/all");
  }

  // Obtener un instructor por ID
  getById(id) {
    return apiClient.get(`/find/${id}`);
  }

  // Agregar un nuevo instructor
  postTeacher(data) {
    return apiClient.post("/add", data);
  }

  // Agregar múltiples instructores de forma masiva
  postMassiveTeachers(data) {
    return apiClient.post("/addMassive", data);
  }

  // Actualizar un instructor 
  putTeacher(id, updatedData) {
    return apiClient.put(`/update/${id}`, { data: updatedData });
  }


  // Eliminar un instructor
  deleteTeacher(id) {
    return apiClient.delete(`/delete/${id}`);
  }
}

// Exporta la clase para ser instanciada
export default new TeacherService();
