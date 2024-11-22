"use client";
import React from 'react';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';

const ConfirmationModal = ({
  isOpen,
  title = '¿Está seguro?',
  message = 'Esta opción es irreversible.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  icon: IconComponent = IoAlertCircleOutline, // Icono predeterminado
  iconColor = 'text-orange-400', // Color del icono predeterminado
  children, // Para contenido personalizado
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-[438px] max-h-full rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-gray-800 bg-opacity-91">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center ml-2 mr-2 font-medium">
              <div className="flex-grow flex justify-center">
                <IconComponent className={iconColor} style={{ fontSize: '120px' }} />
              </div>
              <h2 className='text-2xl font-medium'>{title}</h2>
              <p className='text-gray-500 text-lg mt-1'>{message}</p>
              {children && <div className="mt-4">{children}</div>}
            </div>
            <div className='flex justify-between font-medium text-lg text-white mt-6 ml-2'>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="flex items-center bg-red-600 rounded-xl p-1 ml-3 px-5 hover:bg-red-900"
                >
                  <AiOutlineClose className="mr-2" /> {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex items-center bg-green rounded-xl p-1 px-4 hover:bg-green-700"
                >
                  <FaRegTrashAlt className="mr-2" /> {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
