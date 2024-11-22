import axios from 'axios';

class UserService {
  // Define la URL base de la API
  user = 'http://localhost:8081/api/v1/hermesapp/user';

  // Método para obtener el token de manera segura
  getToken() {
    if (typeof window !== "undefined") {
      // Verifica que estemos en el cliente antes de acceder al localStorage
      return localStorage.getItem("token");
    }
    return null;
  }

  // Obtener todos los usuarios
  getAll() {
    const token = this.getToken();
    console.log("token:", token);
    if (!token) {
      throw new Error("Token no encontrado");
    }
    return axios.get(`${this.user}/all`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  // Obtener usuario por ID
  getById(id) {
    const token = this.getToken();
    console.log("token:", token);
    if (!token) {
      throw new Error("Token no encontrado");
    }
    return axios.get(`${this.user}/by-id/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  // Agregar un nuevo usuario
  postUser(data) {
    const token = this.getToken();
    console.log("token:", token);
    if (!token) {
      throw new Error("Token no encontrado");
    }
    return axios.post(`${this.user}/add`, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  // Actualizar un usuario por ID
  updateById(id, data) {
    const token = this.getToken();
    console.log("token:", token);
    if (!token) {
      throw new Error("Token no encontrado");
    }
    return axios.put(`${this.user}/update/${id}`, data, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }
}

export default new UserService();
