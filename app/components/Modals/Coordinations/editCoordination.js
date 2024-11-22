"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import trainingCentersService from '@/app/services/trainingCentersService';
import coordinationService from '@/app/services/coordinationService';
import { notifyError, notifySuccess } from "../../notification";


const EditCoordination = ({ isOpen, onClose, coordinationId, fetchCoordinations }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState(""); // Cambia a "" por defecto
  const [trainingCenterId, setTrainingCenterId] = useState(null);
  const [trainigCenterName, setTrainingCenterName] = useState("");
  const [training_center, setTraining_center] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCoordinationData = async (id) => {
    try {
      const response = await coordinationService.getById(id);
      const coordination = response.data.data;
      //console.log("Fetched coordination data:", coordination);
  
      setName(coordination.name || "");
      setDescription(coordination.description || "");
      setState(coordination.state !== undefined ? (coordination.state ? "true" : "false") : ""); // Establece el valor como "true" o "false"

      // Verifica la estructura de trainingCenterDTO
      console.log("Training Center DTO:", coordination.trainingCenterDTO);

      const trainingId = coordination.trainingCenterDTO ? coordination.trainingCenterDTO.id : null;
      const trainingName = coordination.trainingCenterDTO ? coordination.trainingCenterDTO.name : "Sin centro de formación";
      console.log("ID del centro de formación:", trainingId);
      console.log("Nombre del centro de formación:", trainingName);
  
      setTrainingCenterId(trainingId);
      setTrainingCenterName(trainingName); 
    } catch (error) {
      console.error("Error al obtener la coordinación:", error);
    }
  };
  

  useEffect(() => {
    if (isOpen && coordinationId) {
      fetchCoordinationData(coordinationId);
    }
  }, [isOpen, coordinationId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const putCoordination = {
        data: {
          name: name || "",
          description: description || "",
          state: state === "true", 
          trainingCenterDTO: trainingCenterId,
        },
      };
  
      //console.log("Datos enviados para actualizar la coordinación:", putCoordination.data);
  
      await coordinationService.putStudyCoordination(coordinationId, putCoordination);
      notifySuccess("Coordinacion actualizada con éxito.");
      onClose();
      fetchCoordinations();
    } catch (error) {
      console.error("Error al guardar la coordinación:", error);
      notifyError("Error al editar coordinación");
    }
    setLoading(false);
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
            <h2 className="text-2xl font-medium dark:text-white">Editar Coordinación</h2>
            <p className="text-gray-500">Actualiza la información de la coordinación seleccionada.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 dark:text-white font-medium">Nombre de la Coordinación:</label>
              <input
                type="text"
                id="name"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full p-2 border border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 dark:text-white font-medium">Descripción:</label>
              <textarea
                id="description"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full p-2 border border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado de la Coordinación:</label>
              <select
                id="state"
                value={state} // Cambiado para reflejar "true" o "false"
                onChange={(e) => setState(e.target.value)}
                className="block w-full p-2.5 border border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Selecciona un estado</option>
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
            <div>
              <label htmlFor="training_center" className="block mb-2 dark:text-white font-medium">Centro de
                Formación:</label>
              <input
                  type="text"
                  id="training_center"
                  placeholder="Centro de formación"
                  value={trainigCenterName}
                  readOnly
                  className="block w-full p-2 border border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
          <button
              type="button"
              className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              onClick={handleSave}
              disabled={loading}
          >
            <FiSave className="mr-2" />
            {loading ? 'Guardando...' : 'Guardar registro'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCoordination;
