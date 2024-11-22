"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import programService from '../../../services/programService';
import coordinationService from '@/app/services/coordinationService';
import { notifySuccess, notifyError } from '../../../components/notification';

const AddProgram = ({ isOpen, onClose, fetchPrograms }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trainingLevel, setTrainingLevel] = useState('');
  const [state, setState] = useState('')
  const [coordination, setCoordination] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [coordinations, setCoordinations] = useState([]);

  useEffect(() => {
    const fetchCoordinations = async () => {
      try {
        const response = await coordinationService.getAll();
        console.log('Respuesta completa de coordinaciones:', response);
        setCoordinations(response.data.data || []);
      } catch (error) {
        console.error('Error fetching coordinations:', error);
      }
    };


    fetchCoordinations();
  }, []);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "EL programa es obligatorio";
    if (!description) newErrors.description = "La descripción es obligatoria";
    if (!trainingLevel) newErrors.trainingLevel = "EL nivel de formación es obligatorio";
    if (!state) newErrors.state = "El estado es obligatorio";
    if (!coordination) newErrors.coordination = "La coordinación es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const newProgram = {
        data: {
          name,
          description,
          training_level: trainingLevel,
          state: state === 'true',
          coordination: coordination,
        }
      };

      console.log('Datos a enviar:', newProgram);

      try {
        await programService.postProgram(newProgram);
        notifySuccess('Programa agregado con exito')
        onClose();
        fetchPrograms();
      } catch (error) {
        console.error("Error al guardar eL programa", error);
        notifyError("No se pudo agregar el programa");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
      {successMessage && (
        <div className="absolute top-4 right-4 p-5 text-custom-green text-xl font-semibold bg-alert-green rounded-xl shadow-lg dark:bg-green-800 dark:text-green-400 flex items-center">
          <FaCheckCircle className="mr-2 text-2xl" />
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
            <h2 className="text-2xl font-medium dark:text-white">Agregar un programa</h2>
            <p className='text-gray-500'>Completa la información para agregar un nuevo programa.</p>
          </div>
        </div>

        {/* Contenedor principal con grid para dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 dark:text-white font-medium">Nombre:</label>
              <input
                type="text"
                id="name"
                placeholder="Nombre del programa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>


            <div>
              <label htmlFor="trainingLevel" className="block mb-2 dark:text-white font-medium">Nivel de formación:</label>
              <select
                id="trainingLevel"
                value={trainingLevel}
                onChange={(e) => setTrainingLevel(e.target.value)}
                className={`block w-full p-2.5 border ${errors.trainingLevel ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Seleccionar</option>
                <option value="Tecnico">Técnico</option>
                <option value="Tecnologo">Tecnólogo</option>
              </select>
              {errors.trainingLevel && <p className="text-red-500">{errors.trainingLevel}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 dark:text-white font-medium">
                Descripción:
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`block w-full p-4 border ${errors.description ? "border-red-500" : "border-custom-blues"} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.description ? "red-500" : "green-500"} dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  rows="2"
                ></textarea>
                <div className="absolute bottom-1 right-1 w-4 h-4 pointer-events-none" aria-hidden="true">
                </div>
              </div>
              {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>
          {/* Columna derecha */}
          <div className="space-y-4">
          <div>
              <label htmlFor="Coordination" className="block mb-2 dark:text-white font-medium">Coordinación:</label>
              <select
                id="Coordination"
                value={coordination}
                onChange={(e) => setCoordination(e.target.value)}
                className={`block w-full p-2 border ${errors.coordination ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}                        >

                <option value="">Selecciona la coordinación</option>
                {Array.isArray(coordinations) && coordinations.map((coord) => (
                  <option key={coord.id} value={coord.id}>{coord.name}</option>
                ))}
              </select>

              {errors.coordination && <p className="text-red-500">{errors.coordination}</p>}
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado:</label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
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

export default AddProgram;