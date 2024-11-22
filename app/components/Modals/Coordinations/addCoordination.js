"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import trainingCentersService from "@/app/services/trainingCentersService";
import coordinationService from "@/app/services/coordinationService";
import { notifySuccess, notifyError } from '../../../components/notification';

const AddCoordinations = ({ isOpen, onClose, fetchCoordinaion }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [trainingCenterDTO, settrainingCenterDTO] = useState("");
  const [errors, setErrors] = useState({});
  const [centers, setCenters] = useState([]);

  
 
  const fetchTrainingCenters = async () => {
    try {
      const response = await trainingCentersService.getAll();
      const types = response.data.data;
      setCenters(types);
    } catch (error) {
      console.error("Error al obtener los centros:", error.message);
      setFetchError("No se pudieron cargar los centros.");
      setCenters([]);
    }
  };
  

   useEffect(() => {
    fetchTrainingCenters();

  }, []);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!description) newErrors.description = "La descripción es obligatoria.";
    if (!state) newErrors.state = "El estado es obligatorio.";
    if (!trainingCenterDTO) newErrors.trainingCenterDTO = "El centro de formacion es obligatorio.";
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const newCoordination = {
        data: {
          name,
          description,
          state,
          trainingCenterDTO: {
            id: trainingCenterDTO,
          },
        },
      };
      
      try {
      
        const response= await coordinationService.postCoordination(newCoordination)
        notifySuccess("Coordinación agregada con éxito")
        console.log("Respuesta del servidor:", response);
        onClose();
        fetchCoordinaion();
      } catch (error) {
        console.error("Error al guardar la coordinación:", error);
        if (error.response && error.response.status === 409) {
          setErrors(prev => ({ ...prev, general: "Esta coordinación ya existe." }));
        }
      }
    }
  };
  

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
            <h2 className="text-2xl font-medium dark:text-white">
              Agregar Coordinación
            </h2>
            <p className="text-gray-500">
              Completa la información para agregar una coordinación nueva.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Contenido de la izquierda */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 dark:text-white font-medium"
              >
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nombres"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full p-2 border ${
                  errors.name ? "border-red-500" : "border-custom-blues"
                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${
                  errors.name ? "red-500" : "green-500"
                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado de la coordinacion:</label>
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
          {/* Contenido de la derecha */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="training_center"
                className="block mb-2 dark:text-white font-medium"
              >
                Centro de formación:
              </label>
              <select
                id="training_center"
                value={trainingCenterDTO}
                onChange={(e) => settrainingCenterDTO(e.target.value)}
                className={`block w-full p-2.5 border ${errors.trainingCenterDTO ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Seleccionar</option>
                {centers.map((trainingCenterDTO) => (
                  <option key={trainingCenterDTO.id} value={trainingCenterDTO.id}>
                    {trainingCenterDTO.name}
                  </option>
                ))}
              </select>
              {errors.trainingCenterDTO && <p className="text-red-500">{errors.trainingCenterDTO}</p>}
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
        </div>
        <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
          <button
            type="button"
            className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            onClick={handleSave}
          >
            <FiSave className="mr-2" />{" "}
            {/* Icono con un margen derecho para separar del texto */}
            Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCoordinations;
