"use client"
import React from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";

const DetailsEquipment = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
      <div className="relative p-6 w-[400px] h-auto max-h-[80%] overflow-y-auto bg-white rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-custom-blue">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b  dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full p-2 dark:hover:bg-gray-700 dark:hover:text-white transition-all"
          >
            <IoIosArrowBack size={24} />
          </button>
          <div className="text-center flex-grow">
            <h2 className="text-2xl font-semibold dark:text-white">Detalles</h2>
            <p className="text-gray-500 dark:text-gray-400">Detalles de equipo registrado</p>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="text-lg font-semibold dark:text-white mb-4">Información del equipo</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium dark:text-white">Nombre:</h4>
              <p className="text-gray-500 dark:text-gray-300">Juan Andres</p>
              <h4 className="font-medium dark:text-white mt-4">Tipo de documento:</h4>
              <p className="text-gray-500 dark:text-gray-300">Cédula de ciudadanía</p>
              <h4 className="font-medium dark:text-white mt-4">Cargo:</h4>
              <p className="text-gray-500 dark:text-gray-300">Aprendiz</p>
              <h4 className="font-medium dark:text-white mt-4">Número de serie:</h4>
              <p className="text-gray-500 dark:text-gray-300">ABC123456789</p>
              <h4 className="font-medium dark:text-white mt-4">Marca:</h4>
              <p className="text-gray-500 dark:text-gray-300">Lenovo</p>
              <h4 className="font-medium dark:text-white mt-4">Modelo:</h4>
              <p className="text-gray-500 dark:text-gray-300">Ideapad 1i</p>
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Apellido:</h4>
              <p className="text-gray-500 dark:text-gray-300">Garcia Lopez</p>
              <h4 className="font-medium dark:text-white mt-4">N de documento:</h4>
              <p className="text-gray-500 dark:text-gray-300">1032937845</p>
              <h4 className="font-medium dark:text-white mt-4">Color:</h4>
              <p className="text-gray-500 dark:text-gray-300">Azul oscuro</p>
              <h4 className="font-medium dark:text-white mt-4">Tipo de equipo:</h4>
              <p className="text-gray-500 dark:text-gray-300">Laptop</p>
              <h4 className="font-medium dark:text-white mt-4">Fecha:</h4>
              <p className="text-gray-500 dark:text-gray-300">2024/07/25</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t dark:border-gray-600">
          <button
            type="button"
            className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-800 rounded-lg transition dark:bg-red-500 dark:hover:bg-red-700"
            onClick={onClose}
            
          >
            <AiOutlineClose  className="mr-2"/> Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsEquipment;
