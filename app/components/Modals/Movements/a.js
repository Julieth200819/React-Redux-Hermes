"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import headquarterService from '@/app/services/headquarterService';
import equipmentService from '@/app/services/equipmentService';
import peopleService from '@/app/services/peopleService';

const AddEntry = ({ isOpen, onClose }) => {
    const [dateTime] = useState(new Date().toLocaleString());
    const [justification, setJustification] = useState('');
    const [personId, setPersonId] = useState('');
    const [personName, setPersonName] = useState('');
    const [headquarterId, setHeadquarterId] = useState('');
    const [equipmentList, setEquipmentList] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [headquarterOptions, setHeadquarterOptions] = useState([]);
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [documentNumber, setDocumentNumber] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false); 

    //Funcion para obtener las sedes
    useEffect(() => {
        const fetchHeadquarters = async () => {
            try {
                const response = await headquarterService.getAll();
                setHeadquarterOptions(response.data.data || []);
            } catch (error) {
                console.error('Error al obtener las sedes:', error);
            }
        };
        fetchHeadquarters();
    }, []);

    //Funcion para obtener los equipos por id de la persona
    useEffect(() => {
        const fetchEquipment = async () => {
            if (personId) { 
                try {
                    const response = await equipmentService.getEquipmentByPerson(personId);
                    setEquipmentOptions(response.data.data || []);
                    console.log(response.data.data || []);
                } catch (error) {
                    console.error('Error al obtener los equipos:', error);
                }
            }
        };
        fetchEquipment();
    }, [personId]);
    

    const validateForm = () => {
        const newErrors = {};
        if (!personId) newErrors.personId = "La identificación de la persona es obligatoria";
        if (!headquarterId) newErrors.headquarterId = "La sede es obligatoria";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    //funcion para obtener los datos de la persona por numero de documento
    const fetchPersonData = async (documentNumber) => {
        setDocumentNumber(documentNumber);
        if (documentNumber) {
            try {
                const response = await peopleService.getPersonByDocument(documentNumber);
                const personData = response.data.data;
                setPersonId(personData.id);
                setPersonName(`${personData.name} ${personData.lastname}`);
                setErrors(prevErrors => ({ ...prevErrors, personId: "" }));
                setIsButtonEnabled(true); 
            } catch (error) {
                setPersonName('');
                setPersonId('');
                setIsButtonEnabled(false); 
                setErrors(prevErrors => ({
                    ...prevErrors,
                    personId: "No se encontró a la persona con este documento"
                }));
            }
        } else {
            setIsButtonEnabled(false);
        }
    };

    const handleSave = async () => {
        if (validateForm()) {
            const newEntry = {
                personId,
                dateTime,
                justification,
                headquarterId,
                equipmentList: selectedEquipment,
            };

            try {
                await entranceService.postEntrance(newEntry);
                alert('Entrada registrada con éxito');
                onClose();
                setSuccessMessage('¡Los datos se han guardado correctamente!');
                setTimeout(() => {
                    setSuccessMessage('');
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error("Error al guardar la entrada", error);
                console.log(newEntry)
                alert("No se pudo registrar la entrada. " + error.response.data.message);
            }
        }
    };

    //Funcion para seleccionar los equipos
    const handleEquipmentSelection = (equipmentId) => {
        setSelectedEquipment((prevSelected) => {
            if (prevSelected.includes(equipmentId)) {
                return prevSelected.filter(id => id !== equipmentId);
            } else {
                return [...prevSelected, equipmentId];
            }
        });
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
                        <h2 className="text-2xl font-medium dark:text-white">Registrar Entrada</h2>
                        <p className="text-gray-500">Completa la información para registrar una entrada.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="personId" className="block mb-2 dark:text-white font-medium">Identificación de Persona:</label>
                            <input
                                type="text"
                                id="personId"
                                placeholder="Número de documento"
                                value={documentNumber}
                                onChange={(e) => fetchPersonData(e.target.value)}
                                className={"block w-full p-2 border ${errors.personId ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white"}
                            />
                            {errors.personId && <p className="text-red-500">{errors.personId}</p>}
                        </div>

                        <div>
                            <label htmlFor="personName" className="block mb-2 dark:text-white font-medium">Nombre de la Persona:</label>
                            <input
                                type="text"
                                id="personName"
                                value={personName}
                                disabled
                                className="block w-full p-2 border rounded-lg text-gray-500 dark:bg-gray-700 border-custom-green dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="dateTime" className="block mb-2 dark:text-white font-medium">Fecha y Hora:</label>
                            <input
                                id="dateTime"
                                value={dateTime}
                                disabled
                                className="block w-full p-2 border rounded-lg text-gray-500 dark:bg-gray-700 border-custom-green dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="justification" className="block mb-2 dark:text-white font-medium">Justificación:</label>
                            <input
                                type="text"
                                id="justification"
                                placeholder="Motivo de la entrada"
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                className={`block w-full p-2 border ${errors.justification ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                            />
                            {errors.justification && <p className="text-red-500">{errors.justification}</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="headquarterId" className="block mb-2 dark:text-white font-medium">Sede:</label>
                            <select
                                id="headquarterId"
                                value={headquarterId}
                                onChange={(e) => setHeadquarterId(e.target.value)}
                                className={`block w-full p-2 border ${errors.headquarterId ? 'border-red-500' : ''} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                            >
                                <option value="">Seleccione una sede</option>
                                {headquarterOptions.map((headquarter) => (
                                    <option key={headquarter.id} value={headquarter.id}>
                                        {headquarter.name}
                                    </option>
                                ))}
                            </select>
                            {errors.headquarterId && <p className="text-red-500">{errors.headquarterId}</p>}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setIsEquipmentModalOpen(true)}
                                disabled={!isButtonEnabled}
                                className={`w-full py-2 px-4 rounded-lg text-white font-medium ${isButtonEnabled ? 'bg-custom-green' : 'bg-gray-500 cursor-not-allowed'}`}
                            >
                                Seleccionar Equipos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal de Selección de Equipos */}
                {isEquipmentModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
                        <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-lg">
                            <h3 className="text-xl font-medium mb-4">Seleccionar Equipos</h3>
                            <div className="space-y-4">
                                {equipmentOptions.map((equipment) => (
                                    <div key={equipment.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedEquipment.includes(equipment.id)}
                                            onChange={() => handleEquipmentSelection(equipment.id)}
                                            className="mr-2"
                                        />
                                        <span>{equipment.name} - {equipment.brand} - {equipment.model}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => setIsEquipmentModalOpen(false)}
                                    className="p-2 bg-gray-300 text-gray-700 rounded-lg"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 flex justify-center gap-4">                    
                    <button
                        onClick={handleSave}
                        className="p-2 bg-custom-green text-white rounded-lg flex items-center gap-2"
                    >
                        <FiSave /> Guardar Entrada
                    </button>
                </div>
            </div>
        </div>
    );
};