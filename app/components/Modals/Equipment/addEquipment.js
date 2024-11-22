"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi"; 
import equipmentService from '@/app/services/equipmentService';
import PeopleService from '@/app/services/peopleService';

const AddEquipment = ({ isOpen, onClose, fetchEquipments }) => {
    const [document, setDocument] = useState(''); 
    const [brand, setBrand] = useState('');
    const [serial, setSerial] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [state, setState] = useState(''); 
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [personName, setPersonName] = useState('');
    const [personLastName, setPersonLastName] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setDocument('');
        setBrand('');
        setSerial('');
        setModel('');
        setColor('');
        setState('true');
        setErrors({});
        setSuccessMessage('');
    };

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};
        if  (!document) newErrors.document = "La identificación es obligatoria";
        if (!brand) newErrors.brand = "La marca es obligatoria";
        if (!serial) newErrors.serial = "El número de serie es obligatorio";
        if (!model) newErrors.model = "El modelo es obligatorio";
        if (!color) newErrors.color = "El color es obligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchPersonData = async (documentValue) => {
        setDocument(documentValue);
        if (documentValue) {
            try {
                const response = await PeopleService.getPersonByDocument(documentValue);
                const personData = response.data.data;
                setPersonName(personData.name);
                setPersonLastName(personData.lastname);
                setErrors(prevErrors => ({ ...prevErrors, document: "" }));
                setIsButtonEnabled(true);
            } catch (error) {
                setPersonName('');
                setPersonLastName('');
                setIsButtonEnabled(false);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    document: "No se encontró a la persona con este documento"
                }));
            }
        } else {
            setIsButtonEnabled(false);
        }
    };

    const handleSave = async () => {
        if (validateForm()) {
            const newEquipment = {
                data: {
                    document: document,
                    brand,
                    serial,
                    model,
                    color,
                    state,
                }
            };

            try {
                console.log('Datos a enviar:', newEquipment);
                await equipmentService.postEquipment(newEquipment);
                
                setSuccessMessage('¡Equipo agregado con éxito!');
                onClose();                
              
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                console.error("Error al guardar el equipo:", error);

                let errorMessage = "Error al guardar el equipo";
                if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                alert(errorMessage);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
            {successMessage && (
                <div className="absolute top-4 right-4 p-5 text-custom-green text-xl font-semibold bg-alert-green rounded-xl shadow-lg dark:bg-green-800 dark:text-green-400 flex items-center">
                    {successMessage}
                </div>
            )}
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
                        <h2 className="text-2xl font-medium dark:text-white">Agregar un equipo</h2>
                        <p className='text-gray-500'>Completa la información para agregar un nuevo equipo.</p>
                    </div>
                </div>

                {/* Parte Superior del Cuerpo - Información de la Persona */}
                <div className="p-4 space-y-4">
                    <div>
                        <label htmlFor="document" className="block mb-2 dark:text-white font-medium">Número de Documento:</label>
                        <input
                            type="text"
                            id="document"
                            placeholder="Documento de la persona"
                            value={document}
                            onChange={(e) => fetchPersonData(e.target.value)}
                            className={`block w-full p-2 border ${errors.document ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.document && <p className="text-red-500">{errors.document}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="personName" className="block mb-2 dark:text-white font-medium">Nombre:</label>
                            <input
                                type="text"
                                id="personName"
                                value={personName}
                                disabled
                                className="block w-full p-2 border rounded-lg text-gray-500 dark:bg-gray-700 border-custom-green dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="personLastName" className="block mb-2 dark:text-white font-medium">Apellido:</label>
                            <input
                                type="text"
                                id="personLastName"
                                value={personLastName}
                                disabled
                                className="block w-full p-2 border rounded-lg text-gray-500 dark:bg-gray-700 border-custom-green dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Parte Inferior del Cuerpo - Información del Equipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div>
                        <label htmlFor="brand" className="block mb-2 dark:text-white font-medium">Marca:</label>
                        <input
                            type="text"
                            id="brand"
                            placeholder="Marca del equipo"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className={`block w-full p-2 border ${errors.brand ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.brand && <p className="text-red-500">{errors.brand}</p>}
                    </div>

                    <div>
                        <label htmlFor="serial" className="block mb-2 dark:text-white font-medium">Número de serie:</label>
                        <input 
                            type="text" 
                            id="serial" 
                            placeholder="Número de serie del equipo"
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}                            
                            className={`block w-full p-2 border ${errors.serial ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.serial && <p className="text-red-500">{errors.serial}</p>}
                    </div>

                    <div>
                        <label htmlFor="model" className="block mb-2 dark:text-white font-medium">Modelo:</label>
                        <input
                            id="model"
                            placeholder="Modelo del equipo"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className={`block w-full p-2 border ${errors.model ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.model && <p className="text-red-500">{errors.model}</p>}
                    </div>

                    <div>
                        <label htmlFor="color" className="block mb-2 dark:text-white font-medium">Color:</label>
                        <input
                            id="color"
                            placeholder="Color del equipo"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className={`block w-full p-2 border ${errors.color ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.color && <p className="text-red-500">{errors.color}</p>}
                    </div>

                    <div>
                        <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado:</label>
                        <select
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className={`block w-full p-2.5 border ${errors.state ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                        {errors.state && <p className="text-red-500">{errors.state}</p>}
                    </div>
                </div>

                <div className="flex justify-center p-4 border-t dark:border-green-500">
                    <button
                        type="button"
                        disabled={!isButtonEnabled}
                        onClick={handleSave}
                        className="flex items-center gap-2 p-2 px-4 rounded-lg text-white bg-custom-green dark:bg-green-600 hover:bg-green-700 transition-colors"
                    >
                        <FiSave className="h-5 w-5" />
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEquipment;
