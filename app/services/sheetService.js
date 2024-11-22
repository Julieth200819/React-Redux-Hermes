import axios from "axios";

class SheetService {
    // Define la URL base de la API
    studySheet = 'http://localhost:8081/api/v1/hermesapp/study_sheet';

    // Método para obtener el token
    getToken() {
        if (typeof window !== "undefined") {
            // Asegura que estamos en el cliente
            return localStorage.getItem("token");
        }
        return null;
    }

    // Obtener todos los centros de formación
    getAll() {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.get(`${this.studySheet}/all`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Obtener centro de formación por ID
    getById(id) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.get(`${this.studySheet}/find/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Agregar una nueva hoja de estudio
    postStudySheet(data) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.post(`${this.studySheet}/add`, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Agregar múltiples hojas de estudio (masivamente)
    postStudySheetMassive(data) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.post(`${this.studySheet}/add`, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Actualizar una hoja de estudio
    putStudySheet(id, updatedStudySheetData) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.put(`${this.studySheet}/update/${id}`, updatedStudySheetData, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    // Eliminar una hoja de estudio
    deleteStudySheet(id) {
        const token = this.getToken();
        console.log("token:", token);
        if (!token) {
            throw new Error("Token no encontrado");
        }
        return axios.delete(`${this.studySheet}/delete/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }
}

export default new SheetService();
