"use client";
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

const EquipmentDetails = ({ isOpen, onClose, equipment, isSelectionMode, onSelectEquipment }) => {
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (isOpen && equipment.length > 0) {
            console.log("Detalles del equipo:", equipment);
        }
    }, [isOpen, equipment]);

    const handleCheckboxChange = (item) => {
        if (selectedEquipment.includes(item)) {
            setSelectedEquipment(selectedEquipment.filter(e => e !== item));
        } else {
            setSelectedEquipment([...selectedEquipment, item]);
        }
    };

    const handleConfirmSelection = () => {
        onSelectEquipment(selectedEquipment); 
        setSuccessMessage("Equipos seleccionados correctamente");
        setTimeout(() => setSuccessMessage(''), 2000); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
            {successMessage && (
                <div className="absolute top-4 right-4 p-5 text-custom-green text-xl font-semibold bg-alert-green rounded-xl shadow-lg dark:bg-green-800 dark:text-green-400 flex items-center">
                    <FaCheckCircle className="mr-2 text-2xl" />
                    {successMessage}
                </div>
            )}
            <div className="relative w-full max-w-screen-sm p-4 bg-opacity-91 bg-white rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-gray-800 max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between p-4 border-b border-custom-blues dark:border-green-500">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-full p-2"
                    >
                        <IoIosArrowBack />
                    </button>
                    <div className="text-center flex-grow">
                        <h2 className="text-2xl font-medium dark:text-white">Detalles del Equipo</h2>
                        <p className='text-gray-500'>Información detallada de cada equipo registrado.</p>
                    </div>
                </div>

                <div className="p-4">
                    {equipment && equipment.length > 0 ? (
                        <ul>
                            {equipment.map(item => (
                                <li key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-custom-blues dark:border-green-500">
                                    <div className="space-y-4">
                                        {isSelectionMode && (
                                            <input
                                                type="checkbox"
                                                checked={selectedEquipment.includes(item)}
                                                onChange={() => handleCheckboxChange(item)}
                                                className="mr-2"
                                            />
                                        )}
                                        <p className="text-gray-500"><strong>Marca:</strong> {item.brand || 'N/A'}</p>
                                        <p className="text-gray-500"><strong>Serial:</strong> {item.serial || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-gray-500"><strong>Modelo:</strong> {item.model || 'N/A'}</p>
                                        <p className="text-gray-500"><strong>Color:</strong> {item.color || 'N/A'}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay detalles de equipos disponibles.</p>
                    )}
                </div>   

                {/* Botón de confirmar selección solo visible en modo selección */}
                {isSelectionMode && (
                    <div className="p-4 flex justify-end">
                        <button
                            onClick={handleConfirmSelection}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Confirmar Selección
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentDetails;
