"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import documentTypeService from "../../../services/documentTypeService";
import { notifySuccess, notifyError } from "../../../components/notification";
import TeacherService from "../../../services/instructorService";

const EditTeacher = ({ isOpen, onClose, teacherData, fetchData }) => {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [address, setAddress] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [document, setDocument] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dateBirth, setDateBirth] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [stateP, setStateP] = useState(true);
    const [state, setState] = useState("");
    const [documentTypes, setDocumentTypes] = useState([]);
    const [id, setId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && teacherData) {
            console.log("Datos del instructor:", teacherData);
            setState(teacherData.person.state || "");
            setId(teacherData.id); 
        }
    }, [isOpen, teacherData]);
    console.log("ID del instructor:", id);

    
    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const response = await documentTypeService.getAll();
                setDocumentTypes(response.data.data);
            } catch (error) {
                console.error("Error al obtener tipos de documentos:", error.message);
            }
        };

        fetchDocumentTypes();

        if (isOpen && teacherData) {
            setName(teacherData.person.name || "");
            setLastname(teacherData.person.lastname || "");
            setAddress(teacherData.person.address || "");
            setDocumentType(teacherData.person.document_type?.id || "");
            setDocument(teacherData.person.document || "");
            setEmail(teacherData.person.email || "");
            setPhone(teacherData.person.phone || "");
            setDateBirth(teacherData.person.date_birth || "");
            setBloodType(teacherData.person.blood_type || "");
            setStateP(teacherData.stateP || true);
            setState(teacherData.person.state || "");
        }
    }, [isOpen, teacherData]);

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        if (!id) {
            console.error("El ID del instructor no está definido.");
            notifyError("Error: No se encontró el ID del instructor.");
            return;
        }
    
        try {
            const updatedData = {
                document,
                name,
                lastname,
                date_birth: dateBirth,
                blood_type: bloodType,
                address,
                email,
                phone,
                stateP: true,
                document_type: documentType,
                stateT: state.toString(),
            };
    
            console.log("Datos enviados al backend:", updatedData);

            const response = await TeacherService.putTeacher(id, updatedData);
            notifySuccess("Instructor actualizado con éxito");
            fetchData(); 
            onClose(); 
        } catch (error) {
            console.error("Error al actualizar el instructor:", error);
            notifyError("Error al actualizar el instructor.");
        }
    };    
    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
            <div className="relative w-full max-w-screen-sm p-4 rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-gray-800 bg-opacity-91 bg-white max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between p-4 border-b border-custom-blues dark:border-green-500">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-full p-2"
                    >
                        <IoIosArrowBack size={24} />
                    </button>
                    <div className="text-center flex-grow">
                        <h2 className="text-2xl font-medium dark:text-white">
                            Editar instructor
                        </h2>
                        <p className="text-gray-500">
                            Actualiza la información de la persona seleccionada.
                        </p>
                    </div>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 dark:text-white font-medium"
                        >
                            Nombre:<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Nombres"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`block w-full p-2 border ${errors.name ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.name ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block mb-2 dark:text-white font-medium">
                            Apellido<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            value={lastname}
                            placeholder="Apellido"
                            onChange={(e) => setLastname(e.target.value)}
                            className={`block w-full p-2 border ${errors.lastname ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.lastname ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        />
                        {errors.lastname && (
                            <p className="text-sm text-red-500">{errors.lastname}</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                            Dirección<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`block w-full p-2 border ${errors.address ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.address ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                            Tipo de Documento<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className={`block w-full p-2 border ${errors.documentType ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.documentType ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        >
                            <option value="">Seleccione una opción</option>
                            {documentTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {errors.documentType && (
                            <p className="text-sm text-red-500">{errors.documentType}</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                            Documento<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={document}
                            placeholder="Número de documento"
                            onChange={(e) => setDocument(e.target.value)}
                            className={`block w-full p-2 border ${errors.document ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.document ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        />
                        {errors.document && (
                            <p className="text-sm text-red-500">{errors.document}</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                            Correo Electrónico<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full p-2 border ${errors.email ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.email ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                            Teléfono<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="Número de celular"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`block w-full p-2 border ${errors.phone ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.lastname ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                            Fecha de Nacimiento<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={dateBirth}
                            onChange={(e) => setDateBirth(e.target.value)}
                            className={`block w-full p-2 border ${errors.dateBirth ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.dateBirth ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        />
                        {errors.dateBirth && (
                            <p className="text-sm text-red-500">{errors.dateBirth}</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                            Tipo de Sangre<span className="text-red-500">*</span>
                        </label>
                        <select
                            className={`block w-full p-2.5 border ${errors.bloodType ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.bloodType ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                            value={bloodType}
                            onChange={(e) => setBloodType(e.target.value)}
                        >
                            <option value="" disabled>
                                Seleccionar
                            </option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        {errors.bloodType && (
                            <p className="text-sm text-red-500">{errors.bloodType}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="state"
                            className="block mb-2 dark:text-white font-medium"
                        >
                            Estado:<span className="text-red-500">*</span>
                        </label>
                        <select
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value === "true")}
                            className={`block w-full p-2.5 border ${errors.state ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.state ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        >
                            <option value="" disabled>
                                Seleccionar
                            </option>
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                        {errors.state && <p className="text-red-500">{errors.state}</p>}
                    </div>
                </form>
                <div className="flex justify-end mt-4">
                    <div className="flex justify-end p-4 border-custom-blues dark:border-green-500">
                        <button
                            type="button"
                            className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                            onClick={handleUpdate}
                        >
                            <FiSave className="mr-2" />
                            Guardar registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTeacher;
