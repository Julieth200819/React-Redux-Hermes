import axios from "axios";

class LoginService {
  // URL base de la API para login
  documentTypeApi = 'http://localhost:8081/api/v1/hermesapp/auth/login';

  // Inicializar el servicio
  constructor() {
    // Configurar el interceptor de Axios para incluir el token en las solicitudes
    this.setupAxiosInterceptor();
  }

  // Método para configurar el interceptor de Axios
  setupAxiosInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        // Evitar modificar solicitudes al login o si ya tiene un Authorization
        if (!config.url.includes('/auth/login') && !config.headers["Authorization"]) {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
  

  // Método para realizar login y almacenar el token
  async postDocumentType(data) {
    try {
      // Realiza la solicitud POST al backend para obtener el token
      const response = await axios.post(`${this.documentTypeApi}`, data);


      console.log("data of login: ", response.data.role);
      // Si la respuesta contiene el JWT, se almacena en el localStorage
      if (response.data.jwt) {
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.jwt);
      }
      

      // Devuelve los datos de la respuesta
      return response.data;
    } catch (err) {
      console.log("No fue posible loggearse: ", err);
      throw err; // Lanza el error para que pueda ser manejado por otros componentes si es necesario
    }
  }

  // Método para cerrar sesión y eliminar el token del localStorage
  logout() {
    localStorage.removeItem("token"); // Elimina el token al hacer logout
    axios.defaults.headers["Authorization"] = ''; // Limpia el token en las solicitudes de Axios
  }
}

export default new LoginService();
