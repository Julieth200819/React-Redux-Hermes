import axios from "axios";

class StudentService {
    // Define la URL base de la API
    students = 'http://localhost:8081/api/v1/hermesapp/student';

    // Método para obtener el token de manera segura
    getToken() {
        if (typeof window !== "undefined") {
            // Verifica que estemos en el cliente antes de acceder al localStorage
            return localStorage.getItem("token");
        }
        return null;
    }

    // Obtener todos los estudiantes
    getAll() {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.get(`${this.students}/all`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Obtener un estudiante por ID
    getById(id) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.get(`${this.students}/findId/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

     // trae al estudiante por documento
     getStudentCard(document) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.get(`${this.students}/findDocument/${document}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Agregar un nuevo estudiante
    postStudent(data) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.post(`${this.students}/add`, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Agregar múltiples estudiantes de forma masiva
    postMassiveStudent(people) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.post(`${this.students}/addMassive`, people, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Actualizar un estudiante por id
    putStudent(id, updatedStudentsData) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.put(`${this.students}/update/${id}`, updatedStudentsData, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

     // Actualizar un estudiante por documento
     putStudentCard(idOrDocument, updatedStudentsData, isDocument = false) {
        const token = this.getToken();
        if (!token) {
            throw new Error("Token no encontrado");
        }

        const url = isDocument
            ? `${this.students}/updateMovil/${idOrDocument}`
            : `${this.students}/update/${idOrDocument}`;
        console.log('@@@ ', updatedStudentsData )
        return axios.put(url, updatedStudentsData, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    

    // Eliminar un estudiante
    deleteStudents(id) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.delete(`${this.students}/delete/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }
}

export default new StudentService();
