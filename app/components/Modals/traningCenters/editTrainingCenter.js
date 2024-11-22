"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import trainingCentersService from "@/app/services/trainingCentersService";
import { notifyError, notifySuccess } from "../../notification";

const EditTrainingCenter = ({ isOpen, onClose, centerId, fetchCenters }) => {
    const [name, setName] = useState("");
    const [state, setState] = useState(true);
    const [errors, setErrors] = useState({});

    // Cargar los datos del centro de formación a editar cuando el modal se abre
    useEffect(() => {
        const fetchCenterData = async (centerId) => {
            try {
                console.log("Buscando centro con ID:", centerId.id); // Verifica que el ID sea correcto
                const response = await trainingCentersService.getById(centerId.id);
                console.log("Respuesta del centro de formación:", response); // Verifica el formato de la respuesta
                const centerDataArray = response.data.data;
    
                // Asegúrate de que los datos existen y es un array
                if (Array.isArray(centerDataArray) && centerDataArray.length > 0) {
                    const centerData = centerDataArray[0]; // Toma el primer elemento del array
                    console.log("Datos del centro:", centerData); // Muestra los datos para verificar su formato
                    setName(centerData.name || "");  // Verifica que el campo 'name' esté presente
                    setState(centerData.state || true);
                } else {
                    notifyError("No se encontró el centro de formación con el ID:", centerId);
                }
            } catch (error) {
                notifyError("Error al cargar el centro de formación:", error.message);
            }
        };
    
        if (isOpen && centerId && centerId.id) {
            fetchCenterData(centerId);
        }
    }, [centerId, isOpen]);
    
    
    
    if (!isOpen) return null; // Evita que el modal se muestre cuando isOpen es false

    const validateForm = () => {
        const newErrors = {};
        if (!name) newErrors.name = "El nombre es obligatorio.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        console.log("ID del centro de formación:", centerId); // Verifica que el ID sea correcto
        if (validateForm()) {
            const updatedCenter = {
                data: {
                    name,
                    state,
                },
            };
            try {
                // Asegúrate de pasar solo el ID correcto
                await trainingCentersService.putTrainingCenter(centerId.id, updatedCenter);
                notifySuccess("Centro de formación actualizado con éxito.");
                onClose(); // Cierra el formulario después de guardar
                fetchCenters();
            } catch (error) {
                // Verifica si error.response existe y tiene los datos correctos
                if (error.response) {
                    const errorMessage = error.response.data?.data?.message || error.response.data?.message || "Error desconocido.";
                    notifyError("No se pudo actualizar el centro de formación. " + errorMessage);
                } else {
                    console.error("Error en la solicitud:", error);
                    notifyError("No se pudo actualizar el centro de formación. Error de red o del servidor.");
                }
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
            <div className="relative w-full max-w-screen-sm p-4 rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-gray-800 bg-opacity-91 bg-white max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between p-4 border-b border-custom-blues dark:border-green-500">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-full p-2"
                    >
                        <IoIosArrowBack />
                    </button>
                    <div className="text-center flex-grow">
                        <h2 className="text-2xl font-medium dark:text-white">
                            Editar Centro de formación
                        </h2>
                        <p className="text-gray-500">
                            Modifica la información del centro de formación.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {/* Contenido de la izquierda */}
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 dark:text-white font-medium"
                            >
                                Nombre del centro:
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Nombre del centro"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`block w-full p-2 border ${
                                    errors.name ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${
                                    errors.name ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                    </div>
                    {/* Contenido de la derecha */}
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="state"
                                className="block mb-2 dark:text-white font-medium"
                            >
                                Estado:
                            </label>
                            <select
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value === "true")}
                                className={`block w-full p-2.5 border ${
                                    errors.state ? "border-red-500" : "border-custom-blues"
                                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${
                                    errors.state ? "red-500" : "green-500"
                                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                            {errors.state && <p className="text-red-500">{errors.state}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
                    <button
                        type="button"
                        className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        onClick={handleSave}
                    >
                        <FiSave className="mr-2" />{" "}
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTrainingCenter;
