"use client";
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import coordinationService from '@/app/services/coordinationService';
import programService from '@/app/services/programService';
import { notifyError, notifySuccess } from '../../notification';

const EditProgram = ({ isOpen, onClose, programToEdit, fetchPrograms }) => {
  const [formData, setFormData] = useState({
    name: '',
    coordination: '',
    description: '',
    training_level: '',
    state: true,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [coordinations, setCoordinations] = useState([]);

  useEffect(() => {
    const fetchCoordinations = async () => {
      try {
        const response = await coordinationService.getAll();
        setCoordinations(response.data.data || []);
      } catch (error) {
        console.error('Error fetching coordinations:', error);
        setErrors({ api: 'Error al cargar las coordinaciones. Inténtalo de nuevo.' });
      }
    };

    fetchCoordinations();
  }, []);

  useEffect(() => {
    if (programToEdit) {
      console.log('Datos para editar:', programToEdit);
      setFormData({
        name: programToEdit.name || '',
        coordination: programToEdit.coordination ? programToEdit.coordination.id : '',
        description: programToEdit.description || '',
        training_level: programToEdit.trainingLevel || '',
        state: programToEdit.state // Asignar el estado como string
      });
    }
  }, [programToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); 
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre del programa es requerido.";
    if (!formData.coordination) newErrors.coordination = "La coordinación es requerida.";
    if (!formData.description) newErrors.description = "La descripción es requerida.";
    if (!formData.training_level) newErrors.training_level = "El nivel de formación es requerido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const updatedProgram = {
        data:{ 
        name: formData.name,
        coordination: formData.coordination,
        description: formData.description,
        training_level: formData.training_level,
        state: formData.state == 'true'
      }
      };

      console.log('Datos a enviar:', updatedProgram);

      try {
        // Asegúrate de usar el método correcto para actualizar
        await programService.putProgram(programToEdit.id, updatedProgram);
        onClose();
        fetchPrograms();
        notifySuccess('¡El programa se ha actualizado con éxito!');
      } catch (error) {
        if (error.response) {
          notifyError('Error al actualizar el programa');
          setErrors({ api: error.response.data.message || 'Error al guardar los datos. Inténtalo de nuevo.' });
        } else {
          console.error('Error al actualizar el programa:', error);
          notifyError({ api: 'Error al guardar los datos. Inténtalo de nuevo.' });
        }
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
            <h2 className="text-2xl font-medium dark:text-white">Editar programa</h2>
            <p className='text-gray-500'>Actualiza la información del programa seleccionado.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="NameProgram" className="block mb-2 dark:text-white font-medium">Nombre del programa:</label>
              <input
                type="text"
                id="NameProgram"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="trainingLevel" className="block mb-2 dark:text-white font-medium">Nivel de formación</label>
              <select
                id="trainingLevel"
                name="training_level"
                value={formData.training_level}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.training_level ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                
                <option value="Tecnico">Técnico</option>
                <option value="Tecnologo">Tecnólogo</option>
              </select>
              {errors.training_level && <p className="text-red-500">{errors.training_level}</p>}
            </div>
            <div>
              <label htmlFor="Coordination" className="block mb-2 dark:text-white font-medium">Coordinación:</label>
              <select
                id="Coordination"
                name="coordination"
                value={formData.coordination}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.coordination ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                <option value="">Selecciona la coordinación</option>
                {coordinations.map((coord) => (
                  <option key={coord.id} value={coord.id}>{coord.name}</option>
                ))}
              </select>
              {errors.coordination && <p className="text-red-500">{errors.coordination}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="Description" className="block mb-2 dark:text-white font-medium">Descripción:</label>
              <input
                id="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.description ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="State" className="block mb-2 dark:text-white font-medium">Estado:</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.state ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
          <button
            type="button"
            className="flex justify-center w-full text-white bg-custom-blues border-0 py-2 px-4 focus:outline-none hover:bg-custom-blue-dark rounded-lg"
            onClick={handleSave}
          >
            <FiSave className="mr-2" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProgram;
