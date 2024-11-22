"use client"
import React from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const AlertEquipment = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
      <div className="relative  w-[438px]  max-h-full rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-gray-800 bg-opacity-91">
        <div className="relative bg-white h-96 rounded-xl pt-2 shadow dark:bg-gray-700">
        <div className="flex  p-4">
            <button 
              type="button"
              onClick={onClose}
              className="rounded inline-flex dark:hover:bg-gray-600"
              data-modal-hide="default-modal"
            >
              <IoIosArrowBack  className='w-5 h-5'/>
            </button>
            <div className="flex-grow flex justify-center">
          <IoAlertCircleOutline style={{fontSize:'150px',color: '#F8BB86' }}/>
          </div>
          </div>
          
          <div className=" text-center ml-2 mr-2 font-medium">
                <h2 className='text-2xl font-medium'>¿Esta seguro que desea eliminar este registro?</h2>
                <p className='text-gray-500 text-lg mt-1'>Esta opcion es irreversible</p>
          </div>
          <div className='flex justify-between font-medium text-lg text-white  mt-6 ml-2 '>
            <div>
              <button
              onClick={onClose} 
              className=' flex items-center bg-red-600 rounded-xl p-1 ml-5 px-10 hover:bg-red-900'>
                <AiOutlineClose  className="mr-2"/> Cancelar
              </button>
            </div>
            <div>
              <button className=' flex items-center bg-green rounded-xl p-1 mr-5 px-10 hover:bg-custom-green'>
                <FaRegTrashAlt className="mr-2"/> Eliminar</button>
            </div>

          </div>
          
       

        </div>
      </div>
    </div>
  );
};

export default AlertEquipment;
