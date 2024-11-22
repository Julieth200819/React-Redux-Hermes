"use client";
import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import journeyService from '@/app/services/journeyService';
import { notifySuccess, notifyError } from '../../../components/notification';

const AddJourney = ({ isOpen, onClose, fetchJourney }) => {
    const [name, setName] = useState('');
    const [state, setState] = useState('');
    const [errors, setErrors] = useState({});
    const [fetchError, setFetchError] = useState(null);

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};
        if (!name) newErrors.name = "El nombre de la jornada es obligatorio";
        if (state === "") newErrors.state = "El estado de la ficha es obligatorio.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (validateForm()) {
            const newJourney = {
                data: {
                    name,
                    state
                }
            };
            try {
                const response = await journeyService.postJourney(newJourney);
                console.log("Respuesta del servidor:", response);
                notifySuccess("Jornada guardada con éxito")
                onClose();
                fetchJourney();
            } catch (error) {
                notifyError("Error al guardar la jornada");
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
                        <h2 className="text-2xl font-medium dark:text-white">Agregar una jornada</h2>
                        <p className='text-gray-500'>Completa la información para agregar una nueva jornada.</p>
                    </div>
                </div>
                {/* Contenedor principal con grid para dos columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {/* Columna izquierda */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 dark:text-white font-medium">Nombre Jornada:</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Jornada"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                    </div>
                    {/* Columna derecha */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado de la jornada:</label>
                            <select
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value === "true" ? true : false)}
                                className={`block w-full p-2.5 border ${errors.state ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                            >
                                <option value="">Seleccionar</option>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                            {errors.state && <p className="text-red-500">{errors.state}</p>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end p-4 space-x-2 border-t border-custom-blues">
                    <button
                        type="button"
                        className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        onClick={handleSave}
                    >
                        <FiSave className="mr-2" />
                        Guardar registro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddJourney;