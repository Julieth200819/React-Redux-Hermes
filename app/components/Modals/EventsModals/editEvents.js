"use client";
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import coordinationService from '@/app/services/coordinationService';
import EventService from "@/app/services/eventService";
import environmentsService from '@/app/services/environmentsService';
import { notifySuccess, notifyError, notifyWarning } from '../../../components/notification';

const EditEvent = ({ isOpen, onClose, eventToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    coordination: '',
    startHour: '',
    endHour: '',
    startDate: '',
    endDate: '',
    environment: '',
    state: 'Activo', // Estado inicial como string
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [coordinations, setCoordinations] = useState([]);
  const [environments, setEnvironments] = useState([]);

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

    const fetchEnvironments = async () => {
      try {
        const response = await environmentsService.getAll();
        setEnvironments(response.data.data || []);
      } catch (error) {
        console.error('Error fetching environments:', error);
        setErrors({ api: 'Error al cargar los ambientes. Inténtalo de nuevo.' });
      }
    };

    fetchCoordinations();
    fetchEnvironments();
  }, []);

  useEffect(() => {
    if (eventToEdit) {
      console.log('Datos para editar:', eventToEdit);
      setFormData({
        name: eventToEdit.name || '',
        coordination: eventToEdit.coordination ? eventToEdit.coordination.id : '', // Asegúrate de que esto sea el ID correcto
        startHour: eventToEdit.startHour || '',
        endHour: eventToEdit.endHour || '',
        startDate: eventToEdit.startDate || '',
        endDate: eventToEdit.endDate || '',
        environment: eventToEdit.environment ? eventToEdit.environment.id : '', // Asegúrate de que esto sea el ID correcto
        state: eventToEdit.state ? 'Activo' : 'Inactivo', // Asignar el estado como string
      });
    }
  }, [eventToEdit]);



  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, 
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Limpiar error al cambiar
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre del evento es requerido.";
    if (!formData.coordination) newErrors.coordination = "La coordinación es requerida.";
    if (!formData.startDate) newErrors.startDate = "La fecha de inicio es requerida.";
    if (!formData.endDate) newErrors.endDate = "La fecha de fin es requerida.";
    if (!formData.startHour) newErrors.startHour = "La hora de inicio es requerida.";
    if (!formData.endHour) newErrors.endHour = "La hora de fin es requerida.";
    if (!formData.environment) newErrors.environment = "El ambiente es requerido.";

    // Validar que la fecha de fin sea mayor que la fecha de inicio
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = notifyWarning("La fecha de fin debe ser mayor que la fecha de inicio.");
    }

    // Validar que la hora de fin sea mayor que la hora de inicio
    if (formData.startHour && formData.endHour && formData.startHour > formData.endHour) {
      newErrors.endHour =notifyWarning ("La hora de fin debe ser mayor que la hora de inicio");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const updatedEvent = {
        data: {
          name: formData.name,
          coordination: formData.coordination,
          startHour: formData.startHour,
          endHour: formData.endHour,
          startDate: formData.startDate,
          endDate: formData.endDate,
          environment: formData.environment,
          state: formData.state, // Aquí se manda como string "Activo" o "Inactivo"
        }
      };

      console.log('Datos a enviar:', updatedEvent);

      try {
        await EventService.updateEvent(eventToEdit.id, updatedEvent);
        onClose();
        notifySuccess('¡El evento se ha actualizado correctamente!');
        setTimeout(() => {
          setSuccessMessage('');
          window.location.reload(); // Actualiza la página
        }, 1000);
      } catch (error) {
        if (error.response) {
          console.error('Error al actualizar el evento:', error.response.data);
          setErrors({ api: error.response.data.message || 'Error al guardar los datos. Inténtalo de nuevo.' });
        } else {
          notifyError('Error al actualizar el evento');
          setErrors({ api: 'Error al guardar los datos. Inténtalo de nuevo.' });
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
            <h2 className="text-2xl font-medium dark:text-white">Editar registro</h2>
            <p className='text-gray-500'>Actualiza la información del registro seleccionado.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="Namevent" className="block mb-2 dark:text-white font-medium">Nombre del evento:</label>
              <input
                type="text"
                id="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
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
            <div>
              <label htmlFor="StartHour" className="block mb-2 dark:text-white font-medium">Hora de inicio:</label>
              <input
                type="time"
                id="StartHour"
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.startHour ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.startHour && <p className="text-red-500">{errors.startHour}</p>}
            </div>
            <div>
              <label htmlFor="EndHour" className="block mb-2 dark:text-white font-medium">Hora de fin:</label>
              <input
                type="time"
                id="EndHour"
                name="endHour"
                value={formData.endHour}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.endHour ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.endHour && <p className="text-red-500">{errors.endHour}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="StartDate" className="block mb-2 dark:text-white font-medium">Fecha de inicio:</label>
              <input
                type="date"
                id="StartDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="Environment" className="block mb-2 dark:text-white font-medium">Ambiente:</label>
              <select
                id="Environment"
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.environment ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                <option value="">Selecciona el ambiente</option>
                {environments.map((env) => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
              </select>

              {errors.environment && <p className="text-red-500">{errors.environment}</p>}
            </div>
            <div>
              <label htmlFor="EndDate" className="block mb-2 dark:text-white font-medium">Fecha de fin:</label>
              <input
                type="date"
                id="EndDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.endDate ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
            </div>
            <div>
              <label htmlFor="State" className="block mb-2 dark:text-white font-medium">Estado:</label>
              <select
                id="State"
                name="state"
                value={formData.state} // Cambiar el valor a string "Activo" o "Inactivo"
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.state ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              {errors.state && <p className="text-red-500">{errors.state}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
          <button
            type="button"
            className="flex justify-center w-full text-white bg-[#39A900] hover:bg-[#39A010] focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            onClick={handleSave}
          >
            <FiSave className="size-6 mr-4" />
            Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;