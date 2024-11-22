"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import journeyService from '@/app/services/journeyService';
import { notifySuccess, notifyError } from '../../../components/notification';

const EditJourney = ({ isOpen, onClose, journeyToEdit }) => {
  const [name, setName] = useState('')
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(null);

  const fetchJourneyData = async (id) => {
    try {
      console.log(`Fetching journey for ID: ${id}`);
      const response = await journeyService.getById(id);
      const journey = response.data.data;

      console.log("Fetched journey:", journey);

      setName(journey.name)
      setState(journey.state);
    } catch (error) {
      console.error("Error al obtener la jornada:", error);
    }
  };


  useEffect(() => {
    if (isOpen && journeyToEdit) {
      fetchJourneyData(journeyToEdit);
    }
  }, [isOpen, journeyToEdit]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const putJourney = {
        data: {
          name: name,
          state: state
        }
      };
      console.log("Updating journey with data:", putJourney.data);

      await journeyService.putJourney(journeyToEdit, putJourney);
      notifySuccess('Jornada actualizada con éxito');
      onClose();
    } catch (error) {
      notifyError("Error al actualizar la jornada");
      // Si el error tiene una respuesta (ejemplo: Axios)
      if (error.response) {
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // La solicitud fue realizada, pero no se recibió respuesta
        console.error("Request data:", error.request);
      } else {
        // Algo sucedió al configurar la solicitud
        console.error("Error message:", error.message);
      }
    }
  };

  if (!isOpen) return null;

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
            <h2 className="text-2xl font-medium dark:text-white">Editar la jornada</h2>
            <p className='text-gray-500'>Actualiza la información de la jornada seleccionada.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Contenido de la izquierda */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 dark:text-white font-medium">Nombre:</label>
              <input
                type="text"
                id="name"
                placeholder="Grupo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full p-2 border border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
            </div>
          </div>
          {/* Contenido de la derecha */}
          <div className="space-y-4">
            <div>
              <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado de la jornada:</label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`block w-full p-2.5 border  border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="">Selecciona un estado</option>
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
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

export default EditJourney;