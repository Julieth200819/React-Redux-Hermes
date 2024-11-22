"use client";
import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import environmentsService from '@/app/services/environmentsService';
import HeadquarterService from '@/app/services/headquarterService';
import coordinationService from '@/app/services/coordinationService';
import { notifySuccess, notifyError } from '../../../components/notification';

const EditEnvironments = ({ isOpen, onClose, environmentToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    floor: '',
    capacity: '',
    headquarter: '',
    coordination: '',
    state: true // Agrega el campo de estado
  });
  
  const [errors, setErrors] = useState({});
  const [headquarters, setHeadquarters] = useState([]);
  const [coordinations, setCoordinations] = useState([]);

  // Fetch data for headquarters and coordinations
  useEffect(() => {
    const fetchHeadquarters = async () => {
      try {
        const response = await HeadquarterService.getAll();
        setHeadquarters(response.data.data || []);
      } catch (error) {
        console.error('Error fetching headquarters:', error);
      }
    };

    const fetchCoordinations = async () => {
      try {
        const response = await coordinationService.getAll();
        setCoordinations(response.data.data || []);
      } catch (error) {
        console.error('Error fetching coordinations:', error);
      }
    };

    fetchHeadquarters();
    fetchCoordinations();
  }, []);

  useEffect(() => {
    if (environmentToEdit) {
      setFormData({
        name: environmentToEdit.name || '',
        description: environmentToEdit.description || '',
        floor: environmentToEdit.floor || '',
        capacity: environmentToEdit.capacity || '',
        headquarter: environmentToEdit.headquarter.id || '',
        coordination: environmentToEdit.coordination.id || '',
        state: environmentToEdit.state // Asigna el estado del ambiente a formData
      });
    }
  }, [environmentToEdit]);

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
    if (!formData.name) newErrors.name = "El nombre es requerido.";
    if (!formData.floor) newErrors.floor = "El piso es requerido.";
    if (!formData.capacity) newErrors.capacity = "La capacidad es requerida.";
    if (!formData.headquarter) newErrors.headquarter = "La sede es requerida.";
    if (!formData.coordination) newErrors.coordination = "La coordinación es requerida.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const updatedEnvironment = {
        data: {
          id: environmentToEdit.id, // Agregar el ID del ambiente
          name: formData.name.replace(/\n/g, ""),
          description: formData.description,
          floor: formData.floor,
          capacity: formData.capacity,
          state: formData.state === 'true', // Convierte el valor a booleano
          idheadquarter: formData.headquarter.toString(), // Enviar solo el ID
          idcoordination: formData.coordination.toString() // Enviar solo el ID
        }
      };

      // Agrega un console.log para verificar el objeto que se enviará
      console.log('Datos a enviar:', updatedEnvironment);
      try {
        await environmentsService.updateEnvironment(environmentToEdit.id, updatedEnvironment);
        notifySuccess("El ambiente se ha actualizado con éxito")
        onClose();
      } catch (error) {
        notifyError('Error al actualizar ambiente');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
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
            <h2 className="text-2xl font-medium dark:text-white">Editar Ambiente</h2>
            <p className='text-gray-500'>Actualiza la información del ambiente seleccionado.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 dark:text-white font-medium">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 dark:text-white font-medium">Descripción:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`block w-full p-2 border border-custom-blues rounded-lg`}
              />
            </div>
            <div>
              <label htmlFor="floor" className="block mb-2 dark:text-white font-medium">Piso:</label>
              <input
                type="text"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.floor ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.floor && <p className="text-red-500">{errors.floor}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="capacity" className="block mb-2 dark:text-white font-medium">Capacidad:</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.capacity ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              />
              {errors.capacity && <p className="text-red-500">{errors.capacity}</p>}
            </div>
            <div>
              <label htmlFor="headquarter" className="block mb-2 dark:text-white font-medium">Sede:</label>
              <select
                id="headquarter"
                name="headquarter"
                value={formData.headquarter}
                onChange={handleChange}
                className={`block w-full p-2 border ${errors.headquarter ? 'border-red-500' : 'border-custom-blues'} rounded-lg`}
              >
                <option value="">Selecciona la sede</option>
                {headquarters.map((hq) => (
                  <option key={hq.id} value={hq.id}>{hq.name}</option>
                ))}
              </select>
              {errors.headquarter && <p className="text-red-500">{errors.headquarter}</p>}
            </div>
            <div>
              <label htmlFor="coordination" className="block mb-2 dark:text-white font-medium">Coordinación:</label>
              <select
                id="coordination"
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
        </div>
        <div className="p-4">
          <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado:</label>
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

export default EditEnvironments;
