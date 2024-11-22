"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import HeadquarterService from '@/app/services/headquarterService';
import PeopleService from '@/app/services/peopleService';
import { notifySuccess, notifyError } from '../../../components/notification';
import equipmentService from '@/app/services/equipmentService';
import entranceService from '@/app/services/entranceService';

const AddEntry = ({ isOpen, onClose }) => {
    const [dateTime] = useState(new Date().toLocaleString());
    const [justificacion, setJustification] = useState('');
    const [person_id, setPersonId] = useState('');
    const [personName, setPersonName] = useState('');
    const [personLastName, setPersonLastName] = useState('');
    const [headquarter_id, setHeadquarterId] = useState('');
    const [equipment_list, setEquipmentList] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [headquarters, setHeadquarters] = useState([]);
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [documentNumber, setDocumentNumber] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // Fetch headquarters
    useEffect(() => {
        const fetchHeadquarters = async () => {
            try {
                const response = await HeadquarterService.getAll();
                setHeadquarters(response.data.data || []);
            } catch (error) {
                console.error('Error al obtener las sedes:', error);
            }
        };
        fetchHeadquarters();
    }, []);

    // Fetch equipment by person ID
    useEffect(() => {
        const fetchEquipment = async () => {
            if (person_id) {
                try {
                    const response = await equipmentService.getEquipmentByPerson(person_id);
                    setEquipmentOptions(response.data.data || []);
                } catch (error) {
                    console.error('Error al obtener los equipos:', error);
                }
            }
        };
        fetchEquipment();
    }, [person_id]);

    const validateForm = () => {
        const newErrors = {};
        if (!documentNumber) newErrors.person_id = "La identificación de la persona es obligatoria";
        if (!headquarter_id) newErrors.headquarter_id = "La sede es obligatoria";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchPersonData = async (documentNumber) => {
        setDocumentNumber(documentNumber);
        if (documentNumber) {
            try {
                const response = await PeopleService.getPersonByDocument(documentNumber);
                const personData = response.data.data;
                setPersonId(personData.id);
                setPersonName(personData.name);
                setPersonLastName(personData.lastname);
                setErrors(prevErrors => ({ ...prevErrors, person_id: "" }));
                setIsButtonEnabled(true);
            } catch (error) {
                setPersonName('');
                setPersonLastName('');
                setPersonId('');
                setIsButtonEnabled(false);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    person_id: "No se encontró a la persona con este documento"
                }));
            }
        } else {
            setIsButtonEnabled(false);
        }
    };

    const handleSave = async () => {
        if (validateForm()) {
            const dateTimeFornametted = new Date().toISOString().slice(0, 19);

            const newEntry = {
                data: {
                    dateTime: dateTimeFornametted,
                    justfication: justificacion,
                    person: parseInt(documentNumber),
                    headquarter: parseInt(headquarter_id),
                    equipments: selectedEquipment.map(equipmentId => ({
                        id: equipmentId
                    }))
                }
            };

            try {
                console.log('Datos a enviar:', newEntry);
                await entranceService.postEntrance(newEntry);
                onClose();
                notifySuccess('¡Los datos se han guardado correctamente!');
                setTimeout(() => {
                    setSuccessMessage('');
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error("Error al guardar la entrada", error);
                notifyError("No se pudo registrar la entrada. " + (error.response?.data?.message || error.message));
            }
        }
    };

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

                {/* Parte Superior del Cuerpo */}
                <div className="p-4 space-y-4">
                    <div>
                        <label htmlFor="personId" className="block mb-2 dark:text-white font-medium">Número de Documento:</label>
                        <input
                            type="text"
                            id="personId"
                            placeholder="Número de documento"
                            value={documentNumber}
                            onChange={(e) => fetchPersonData(e.target.value)}
                            className={`block w-full p-2 border ${errors.personId ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.personId && <p className="text-red-500">{errors.personId}</p>}
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

                {/* Parte Inferior del Cuerpo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
                        <label htmlFor="justificacion" className="block mb-2 dark:text-white font-medium">Justificación:</label>
                        <input
                            type="text"
                            id="justificacion"
                            placeholder="Motivo de la entrada"
                            value={justificacion}
                            onChange={(e) => setJustification(e.target.value)}
                            className={`block w-full p-2 border ${errors.justificacion ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.justificacion && <p className="text-red-500">{errors.justificacion}</p>}
                    </div>
                    <div>
                        <label htmlFor="headquarterId" className="block mb-2 dark:text-white font-medium">Sede:</label>
                        <select
                            id="headquarterId"
                            value={headquarter_id}
                            onChange={(e) => setHeadquarterId(e.target.value)}
                            className={`block w-full p-2 border ${errors.headquarterId ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
                        >
                            <option value="">Selecciona la sede</option>
                            {Array.isArray(headquarters) && headquarters.map((headquarter) => (
                                <option key={headquarter.id} value={headquarter.id}>{headquarter.name}</option>
                            ))}
                        </select>
                        {errors.headquarterId && <p className="text-red-500">{errors.headquarterId}</p>}
                    </div>
                    <div>
                        <label htmlFor="equipment_list" className="block mb-2 dark:text-white font-medium">Equipos:</label>
                        <button
                            type="button"
                            onClick={() => setIsEquipmentModalOpen(true)}
                            disabled={!isButtonEnabled}
                            className="block w-full p-2 border border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white"
                        >
                            Seleccionar Equipos
                        </button>
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

export default AddEntry;
