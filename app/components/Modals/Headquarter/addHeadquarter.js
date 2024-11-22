"use client";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import HeadquarterService from "@/app/services/headquarterService";
import trainingCentersService from "@/app/services/trainingCentersService";
import { notifySuccess, notifyError } from '../../../components/notification';

const AddHeadquarter = ({ isOpen, fetchHeadquarters, onClose }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [training_center, setTraining_center] = useState("");
  const [errors, setErrors] = useState({});
  const [centers, setCenters] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // Agregar estado

  useEffect(() => {
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
    fetchTrainingCenters();
  }, []);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!address) newErrors.address = "La dirección es obligatoria.";
    if (!state) newErrors.state = "El estado es obligatorio.";
    if (!training_center)
      newErrors.training_center = "El centro de formación es obligatorio."; // Verifica que este campo no esté vacío

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const newHeadquarter = {
        data: {
          name,
          address,
          state: state === "true",
          fk_id_training_center: parseInt(training_center, 10), // Asegúrate de que sea un número
        },
      };

      console.log("Datos a enviar:", newHeadquarter);

      try {
        await HeadquarterService.addHeadquarter(newHeadquarter);
        onClose();
        fetchHeadquarters();
        notifySuccess("¡La sede se ha guardado correctamente!");

           // Limpiar el formulario
      setName("");
      setAddress("");
      setState("");
      setTraining_center("");

        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        notifyError( "Error al guardar la sede");
        setErrors({ api: "Error al guardar los datos. Inténtalo de nuevo." });
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
              Agregar sede
            </h2>
            <p className="text-gray-500">
              Completa la información para agregar una sede nueva.
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
              <label
                htmlFor="state"
                className="block mb-2 dark:text-white font-medium"
              >
                Estado de la sede:
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={`block w-full p-2.5 border ${
                  errors.state ? "border-red-500" : "border-custom-blues"
                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
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
                htmlFor="address"
                className="block mb-2 dark:text-white font-medium"
              >
                Dirección:
              </label>
              <input
                type="text"
                id="address"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`block w-full p-2 border ${
                  errors.state ? "border-red-500" : "border-custom-blues"
                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${
                  errors.state ? "red-500" : "green-500"
                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.state && <p className="text-red-500">{errors.state}</p>}
            </div>
            <div>
              <label
                htmlFor="training_center"
                className="block mb-2 dark:text-white font-medium"
              >
                Centro de formación:
              </label>
              <select
                id="training_center"
                value={training_center}
                onChange={(e) => setTraining_center(e.target.value)}
                className={`block w-full p-2.5 border ${
                  errors.training_center
                    ? "border-red-500"
                    : "border-custom-blues"
                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Seleccionar</option>
                {centers.map((training_center) => (
                  <option key={training_center.id} value={training_center.id}>
                    {training_center.name}
                  </option>
                ))}
              </select>
              {errors.training_center && (
                <p className="text-red-500">{errors.training_center}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
          <button
            type="button"
            className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            onClick={handleSave}
          >
            <FiSave className="mr-2" /> Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHeadquarter;
