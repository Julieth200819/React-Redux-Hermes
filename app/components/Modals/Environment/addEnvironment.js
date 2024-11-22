"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import HeadquarterService from "../../../services/headquarterService";
import EnvironmentService from "@/app/services/environmentsService";
import coordinationService from "../../../services/coordinationService";
import { notifySuccess, notifyError } from '../../../components/notification';

const AddEnvironments = ({ isOpen, onClose, fetchEnvironments, environmentToEdit }) => {
  const [nameEnvironment, setNameEnvironment] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [state, setState] = useState(true); // Estado booleano
  const [floor, setFloor] = useState('');
  const [headquarter, setHeadquarter] = useState('');
  const [coordination, setCoordination] = useState('');
  const [coordinations, setCoordinations] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState((''));

  useEffect(() => {
    const fetchHeadquarters = async () => {
      try {
        const response = await HeadquarterService.getAll();
        const headquarterResponse = response.data.data;
        console.log('Coordinations response:', headquarterResponse);
        setHeadquarters(headquarterResponse || []);
      } catch (error) {
        console.error('Error fetching headquarters:', error);
        setErrors({ api: 'Error al cargar las Sedes. Inténtalo de nuevo.' });
      }
    };

    const fetchCoordinations = async () => {
      try {
        const response = await coordinationService.getAll();
        const coordinationResponse = response.data.data;
        console.log('Coordinations response:', coordinationResponse);
        setCoordinations(coordinationResponse || []);
      } catch (error) {
        console.error('Error fetching coordinations:', error);
      }
    };


    fetchCoordinations();
    fetchHeadquarters();
  }, []);


  useEffect(() => {
    if (environmentToEdit) {
      setNameEnvironment(environmentToEdit.nameEnvironment);
      setDescription(environmentToEdit.description);
      setCapacity(environmentToEdit.capacity);
      setFloor(environmentToEdit.floor);
      setHeadquarter(environmentToEdit.headquarter);
      setCoordination(environmentToEdit.coordination);
      setState(environmentToEdit.state); // Se establece el estado del ambiente
    } else {
      setNameEnvironment('');
      setDescription('');
      setCapacity('');
      setFloor('');
      setHeadquarter('');
      setCoordination('');
      setState(true); // Estado inicial
      setErrors({});
      setSuccessMessage('');
    };
  }, [environmentToEdit, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!nameEnvironment) newErrors.nameEnvironment = "El nombre es obligatorio.";
    if (!description) newErrors.description = "La descripción es obligatoria.";
    if (!capacity) newErrors.capacity = "La capacidad es obligatoria.";
    if (!floor) newErrors.floor = "El piso es obligatorio.";
    if (!headquarter) newErrors.headquarter = "Debe seleccionar una sede.";
    if (!coordination) newErrors.coordination = "Debe seleccionar una coordinación.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const environmentsData = {
        data: {
          name: nameEnvironment,
          description: description,
          floor: parseInt(floor, 10),
          capacity: parseInt(capacity, 10),
          state: state,
          idheadquarter: parseInt(headquarter, 10),
          idcoordination: parseInt(coordination, 10)
        }
      };

      console.log("Datos enviados:", environmentsData);

      try {
        if (environmentToEdit) {
          await EnvironmentService.updateEnvironment(environmentToEdit.id, environmentsData);
        } else {
          await EnvironmentService.addEnvironment(environmentsData);
        }
        onClose();
        fetchEnvironments();
        notifySuccess('¡Los datos se han guardado correctamente!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error saving environment:', error.response ? error.response.data : error);
        if (error.response) {
          console.error('Error details:', error.response.data);
          console.error('Headers:', error.response.headers);
        }
        notifyError({ api: 'Error al guardar los datos. Inténtalo de nuevo.' });
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
              Agregar Ambiente
            </h2>
            <p className="text-gray-500">
              Completa la información para agregar un nuevo Ambiente.
            </p>
            {successMessage && <p className="text-green-500">{successMessage}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 dark:text-white font-medium">
                Nombre del ambiente:
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nombre"
                value={nameEnvironment}
                onChange={(e) => setNameEnvironment(e.target.value)}
                className={`block w-full p-2 border ${errors.name ? "border-red-500" : "border-custom-blues"} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.name ? "red-500" : "green-500"} dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="capacity" className="block mb-2 dark:text-white font-medium">
                Capacidad:
              </label>
              <input
                type="number"
                id="capacity"
                placeholder="Capacidad"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className={`block w-full p-2 border ${errors.capacity ? "border-red-500" : "border-custom-blues"} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.capacity ? "red-500" : "green-500"} dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.capacity && <p className="text-red-500">{errors.capacity}</p>}
            </div>
            <div>
              <label htmlFor="coordination" className="block mb-2 dark:text-white font-medium">
                Coordinación:
              </label>
              <select
                id="coordination"
                value={coordination}
                onChange={(e) => setCoordination(e.target.value)}
                className={`block w-full p-2 border ${errors.coordination ? "border-red-500" : "border-custom-blues"} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.coordination ? "red-500" : "green-500"} dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="">Selecciona una coordinación</option>
                {coordinations.map((coord) => (
                  <option key={coord.id} value={coord.id}>{coord.name}</option>
                ))}
              </select>
              {errors.coordination && <p className="text-red-500">{errors.coordination}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 dark:text-white font-medium text-lg">
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
          <div className="space-y-4">
            <div>
              <label htmlFor="floor" className="block mb-2 dark:text-white font-medium">
                Piso:
              </label>
              <input
                type="number"
                id="floor"
                placeholder="Piso"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className={`block w-full p-2 border ${errors.floor ? "border-red-500" : "border-custom-blues"} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.floor ? "red-500" : "green-500"} dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.floor && <p className="text-red-500">{errors.floor}</p>}
            </div>
            <div>
              <label htmlFor="headquarter" className="block mb-2 dark:text-white font-medium">
                Sede:
              </label>
              <select
                id="headquarter"
                value={headquarter}
                onChange={(e) => setHeadquarter(e.target.value)}
                className={`block w-full p-2 border ${errors.headquarter ? "border-red-500" : "border-custom-blues"} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.headquarter ? "red-500" : "green-500"} dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="">Selecciona una sede</option>
                {headquarters.map((hq) => (
                  <option key={hq.id} value={hq.id}>{hq.name}</option>
                ))}
              </select>
              {errors.headquarter && <p className="text-red-500">{errors.headquarter}</p>}
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 dark:text-white font-medium">
                Estado:
              </label>
              <select
                id="state"
                value={state ? "true" : "false"}
                onChange={(e) => setState(e.target.value === "true")}
                className="block w-full p-2 border border-custom-blues rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-green-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
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
            <FiSave className="mr-4" />
            Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEnvironments;
