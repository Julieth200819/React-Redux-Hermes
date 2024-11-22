"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import HeadquarterService from "@/app/services/headquarterService";
import trainingCentersService from "@/app/services/trainingCentersService";
import { notifySuccess, notifyError } from "../../../components/notification";

const EditHeadquarter = ({
  isOpen,
  onClose,
  headquarterToEdit,
  fetchHeadquarters,
}) => {
  const { training_center_id } = headquarterToEdit;
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: true,
    trainingCenter: "", // Asegúrate de que este valor esté presente
  });
  console.log("ID del centro de formación:", training_center_id); // Aquí tienes el ID

  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [trainingCenters, setTrainingCenters] = useState([]);

  // Fetch all training centers
  useEffect(() => {
    const fetchTrainingCenters = async () => {
      try {
        const response = await trainingCentersService.getAll();
        setTrainingCenters(response.data.data || []);
      } catch (error) {
        console.error("Error fetching training centers:", error);
        setErrors({
          api: "Error al cargar los centros de formación. Inténtalo de nuevo.",
        });
      }
    };

    fetchTrainingCenters();
  }, []);

  // Set form data when editing a headquarter
  useEffect(() => {
    if (headquarterToEdit) {
      console.log("Contenido completo de headquarterToEdit:", headquarterToEdit);
      setFormData({
        name: headquarterToEdit.name || '',
        address: headquarterToEdit.address || '',
        trainingCenter: headquarterToEdit.trainingCenter ? headquarterToEdit.trainingCenter.id : '',
        state: headquarterToEdit.state || 'Inactivo',
      });
    } else {
      console.log("headquarterToEdit no contiene datos.");
    }
  }, [headquarterToEdit]);
  
  console.log("ID del centro de formación:", headquarterToEdit.training_center_id);


  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es requerido.";
    if (!formData.address) newErrors.address = "La dirección es requerida.";
    if (!formData.trainingCenter)
      newErrors.trainingCenter = "El centro de formación es requerido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const updatedHeadquarter = {
        data: {
          name: formData.name,
          address: formData.address,
          state: formData.state === "true", // Convertir a booleano
          fk_id_training_center: formData.trainingCenter,
        },
      };

      console.log("Datos a enviar:", updatedHeadquarter);

      try {
        await HeadquarterService.updateHeadquarter(
          headquarterToEdit.id,
          updatedHeadquarter
        );
        onClose();
        fetchHeadquarters();
        notifySuccess('¡Los datos se han guardado correctamente!');
        setTimeout(() => { // Actualiza la página
        }, 1000);
      } catch (error) {
        if (error.response) {
          notifyError("Error al actualizar la sede");
          setErrors({
            api:
              error.response.data.message ||
              "Error al guardar los datos. Inténtalo de nuevo.",
          });
        } else {
          notifyError("Error al actualizar la sede");
          setErrors({ api: "Error al guardar los datos. Inténtalo de nuevo." });
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
            <h2 className="text-2xl font-medium dark:text-white">
              Editar Sede
            </h2>
            <p className="text-gray-500">
              Actualiza la información de la sede seleccionada.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full p-2 border ${
                  errors.name ? "border-red-500" : "border-custom-blues"
                } rounded-lg`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
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
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`block w-full p-2 border ${
                  errors.address ? "border-red-500" : "border-custom-blues"
                } rounded-lg`}
              />
              {errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="trainingCenter"
                className="block mb-2 dark:text-white font-medium"
              >
                Centro de Formación:
              </label>
              <select
                id="trainingCenter"
                name="trainingCenter"
                value={formData.trainingCenter}
                onChange={handleChange}
                className={`block w-full p-2 border ${
                  errors.trainingCenter
                    ? "border-red-500"
                    : "border-custom-blues"
                } rounded-lg`}
              >
                <option value="">Selecciona un centro de formación</option>
                {trainingCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
              {errors.trainingCenter && (
                <p className="text-red-500">{errors.trainingCenter}</p>
              )}
            </div>
            {/* Campo de Estado debajo de Centro de Formación */}
            <div>
              <label
                htmlFor="state"
                className="block mb-2 dark:text-white font-medium"
              >
                Estado:
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`block w-full p-2.5 border ${
                  errors.state ? "border-red-500" : "border-custom-blues"
                } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${
                  errors.state ? "red-500" : "green-500"
                } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
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
            <FiSave className="mr-2" /> Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHeadquarter;
