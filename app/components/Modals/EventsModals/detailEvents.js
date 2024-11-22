"use client";
import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";

const DetailEvents = ({ isOpen, onClose}) => {
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
    <div className="relative p-6 w-[600px] h-auto max-h-[80%] overflow-y-auto bg-white rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-gray-800">
    <div className="flex items-center justify-between p-4 border-b border-custom-blues dark:border-green-500">
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-full p-2"
          >
            <IoIosArrowBack />
          </button>
          <div className="text-center flex-grow">
            <h2 className="text-2xl font-medium dark:text-white">Detalles</h2>
            <p className='text-gray-500'>Detalles del evento registrado.</p>
          </div>
        </div>
        {/* Panel de información del evento */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg">
          <div>
            <p className="font-semibold">Nombre del evento:</p>
            <p>Dia del aprendiz</p>
          </div>
          <div>
            <p className="font-semibold">Organizador:</p>
            <p>Diana Yepes</p>
          </div>
          <div>
            <p className="font-semibold">Fecha:</p>
            <p>2024/07/31</p>
          </div>
          <div>
            <p className="font-semibold">Hora:</p>
            <p>11:00am</p>
          </div>
          <div>
            <p className="font-semibold">Coordinación:</p>
            <p>Bienestar</p>
          </div>
          <div>
            <p className="font-semibold">Ambiente:</p>
            <p>Aula 01</p>
          </div>
        </div>
  
      {/* Sección de invitados */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Invitados del evento:</h3>
  
        {/* Invitados externos */}
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Personas Externas</h4>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-2 px-4 text-left">Tipo documento</th>
                <th className="py-2 px-4 text-left">Número de documento</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Apellido</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              <tr className="border-b">
                <td className="py-2 px-4">C.C</td>
                <td className="py-2 px-4">1032397844</td>
                <td className="py-2 px-4">Alejandra</td>
                <td className="py-2 px-4">Urrea</td>
              </tr>
              {/* Puedes añadir más filas aquí */}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end p-4 border-t border-custom-green dark:border-gray-600">
          <button
            type="button"
            className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-800 rounded-lg transition dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={onClose}
            
          >
            <AiOutlineClose  className="mr-2"/> Cerrar
          </button>
        </div>
    </div>
    
  </div>
  

  )
}

export default DetailEvents
