"use client";
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import coordinationService from '@/app/services/coordinationService';
import environmentsService from '@/app/services/environmentsService';
import EventService from "@/app/services/eventService";
import { notifySuccess, notifyError } from '../../../components/notification';

const AddEvents = ({ isOpen, onClose, fetchEvents, eventToEdit }) => {
  const [namevent, setNamevent] = useState('');
  const [coordination, setCoordination] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [environment, setEnvironment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [state, setState] = useState('Inactivo'); // Estado inicial
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const [coordinations, setCoordinations] = useState([]);
  const [environments, setEnvironments] = useState([]);

  useEffect(() => {
    const fetchCoordinations = async () => {
      try {
        const response = await coordinationService.getAll();
        const coordinationResponse = response.data.data;
        console.log('Coordinations response:', coordinationResponse);
        setCoordinations(coordinationResponse || []);
      } catch (error) {
        console.error('Error fetching coordinations:', error);
        setErrors({ api: 'Error al cargar las coordinaciones. Inténtalo de nuevo.' });
      }
    };

    const fetchEnvironments = async () => {
      try {
        const response = await environmentsService.getAll();
        const environmentResponse = response.data.data;
        console.log('Environments response:', environmentResponse);
        setEnvironments(environmentResponse || []);
      } catch (error) {
        console.error("Error fetching environments:", error);
      }
    };

    fetchCoordinations();
    fetchEnvironments();
  }, []);

  useEffect(() => {
    if (eventToEdit) {
      setNamevent(eventToEdit.event_name);
      setCoordination(eventToEdit.coordination);
      setStartHour(eventToEdit.startHour);
      setEndHour(eventToEdit.endHour);
      setEnvironment(eventToEdit.environment);
      setStartDate(eventToEdit.startDate);
      setEndDate(eventToEdit.endDate);
      setState(eventToEdit.state); 
    } else {
      setNamevent('');
      setCoordination('');
      setStartHour('');
      setEndHour('');
      setEnvironment('');
      setStartDate('');
      setEndDate('');
      setState('Inactivo'); // Establece el estado inicial al abrir el formulario
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!namevent) newErrors.namevent = "El nombre de evento es obligatorio.";
    if (!coordination) newErrors.coordination = "Debe seleccionar una coordinación.";
    if (!startHour) newErrors.startHour = "La hora de inicio es obligatoria.";
    if (!endHour) newErrors.endHour = "La hora de fin es obligatoria.";
    if (!startDate) newErrors.startDate = "La fecha de inicio es obligatoria.";
    if (!endDate) newErrors.endDate = "La fecha de fin es obligatoria.";
    if (!environment) newErrors.environment = "Debe seleccionar un ambiente"; 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTime = (time) => {
    return time + ":00"; // Asegúrate de que se envíe como HH:mm:ss
};


  const handleSave = async () => {
    if (validateForm()) {
        // Asegúrate de que la estructura de los datos sea correcta
        const eventData = {
          data: {
            name: namevent,
            state: state.toLowerCase(), // Cambia a minúsculas
            startDate: startDate, // Asegúrate de que sea yyyy-MM-dd
            endDate: endDate,     // Asegúrate de que sea yyyy-MM-dd
            startHour: formatTime(startHour), // Asegúrate de que sea HH:mm:ss
            endHour: formatTime(endHour),     // Asegúrate de que sea HH:mm:ss
            coordination: parseInt(coordination, 10), // Asegúrate de que sea un número
            environment: parseInt(environment, 10),   // Asegúrate de que sea un número
        },
    };
      

        console.log('Event data to save:', eventData);
        console.log('Datos del evento antes de enviar:', eventData);


        try {
            if (eventToEdit) {
                await EventService.updateEvent(eventToEdit.id, eventData); // Usa la función de actualización
            } else {
                await EventService.addEvent(eventData); // Usa la función para agregar
            }
            fetchEvents(); // Actualiza la lista de eventos
            onClose(); // Cierra el modal
            notifySuccess('¡El evento se ha creado correctamente!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving event:', error.response ? error.response.data : error);
            notifyError('Error al crear el evento. Inténtalo de nuevo');
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
          <button type="button" onClick={onClose} className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-full p-2">
            <IoIosArrowBack />
          </button>
          <div className="text-center flex-grow">
            <h2 className="text-2xl font-medium dark:text-white">Agregar registro</h2>
            <p className='text-gray-500'>Completa la información del formulario para agregar un nuevo registro.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Contenido de la izquierda */}
          <div className="space-y-4">
            <div>
              <label htmlFor="Namevent" className="block mb-2 dark:text-white font-medium">Nombre del evento:</label>
              <input 
                type="text" 
                id="Namevent" 
                value={namevent}
                onChange={(e) => setNamevent(e.target.value)}
                className={`block w-full p-2 border ${errors.namevent ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.namevent && <p className="text-red-500">{errors.namevent}</p>}
            </div>
            <div>
              <label htmlFor="Environment" className="block mb-2 dark:text-white font-medium">Ambiente:</label>
              <select 
                id="Environment" 
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
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
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`block w-full p-2 border ${errors.endDate ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
            </div>
            <div>
              <label htmlFor="EndHour" className="block mb-2 dark:text-white font-medium">Hora de fin:</label>
              <input 
                type="time" 
                id="EndHour" 
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className={`block w-full p-2 border ${errors.endHour ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.endHour && <p className="text-red-500">{errors.endHour}</p>}
            </div>
          </div>
          {/* Contenido de la derecha */}
          <div className="space-y-4">
          <div>
              <label htmlFor="Coordination" className="block mb-2 dark:text-white font-medium">Coordinación:</label>
              <select 
                id="Coordination" 
                value={coordination}
                onChange={(e) => setCoordination(e.target.value)}
                className={`block w-full p-2 border ${errors.coordination ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                <option value="">Selecciona la coordinación</option>
                {Array.isArray(coordinations) && coordinations.map((coord) => (
                  <option key={coord.id} value={coord.id}>{coord.name}</option>
                ))}
              </select>
              {errors.coordination && <p className="text-red-500">{errors.coordination}</p>}
            </div>
            <div>
              <label htmlFor="StartDate" className="block mb-2 dark:text-white font-medium">Fecha de inicio:</label>
              <input 
                type="date" 
                id="StartDate" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`block w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="StartHour" className="block mb-2 dark:text-white font-medium">Hora de inicio:</label>
              <input 
                type="time" 
                id="StartHour" 
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className={`block w-full p-2 border ${errors.startHour ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.startHour && <p className="text-red-500">{errors.startHour}</p>}
            </div>
            <div>
              <label htmlFor="State" className="block mb-2 dark:text-white font-medium">Estado:</label>
              <select 
                id="State" 
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`block w-full p-2 border ${errors.state ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                <option value="">Seleccionar</option>
                <option value="progreso">En progreso</option>
                <option value="programado">Programado</option>
                <option value="cancelado">Cancelado</option>
                <option value="aplazado">Aplazado</option>
                <option value="terminado">Terminado</option>
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
            <FiSave className="mr-4" />
            Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvents; 