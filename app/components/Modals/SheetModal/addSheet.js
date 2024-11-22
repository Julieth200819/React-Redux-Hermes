"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import journeyService from "../../../services/journeyService";
import StudySheetService from '@/app/services/sheetService';
import programService from '@/app/services/programService';
import { notifySuccess } from '../../notification';

const AddSheet = ({ isOpen, onClose }) => {
  const [start_lective, setStartLective] = useState('');
  const [end_lective, setEndLective] = useState('');
  const [state, setState] = useState('');
  const [program, setProgram] = useState('');
  const [journey, setJourney] = useState('');
  const [number, setNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [journeys, setJourneys] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [setFetchError] = useState(null);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const response = await journeyService.getAll();
        const types = response.data.data;
        setJourneys(types);
      } catch (error) {
        console.error("Error al obtener tipos de jornadas:", error.message);
        setFetchError("No se pudieron cargar las jornadas");
        setJourneys([]);
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await programService.getAll();
        const types = response.data.data;
        setPrograms(types);
      } catch (error) {
        console.error("Error al obtener programas:", error.message);
        setFetchError("No se pudieron cargar los programas");
        setPrograms([]);
      }
    };

    fetchPrograms();
    fetchJourneys();
  }, []);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!number) newErrors.number = "La ficha es obligatoria.";
    if (!start_lective) newErrors.start_lective = "Debe seleccionar una fecha de inicio.";
    if (!end_lective) newErrors.endLective = "Debe seleccionar una fecha de finalización.";
    if (!state) newErrors.state = "El estado de la ficha es obligatorio.";
    if (!program) newErrors.program = "El programa es obligatorio.";
    if (!journey) newErrors.journey = "La jornada es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const newSheet = {
        data: {
          start_lective: start_lective,
          end_lective: end_lective,
          state: state == 'true',
          program,
          journey,
          number,
        }
      };

      console.log("Datos a enviar", newSheet);
      try {
        await StudySheetService.postStudySheet(newSheet);
        notifySuccess("Ficha agregada exitosamente");
        onClose();
      } catch (error) {
        console.error("Error al guardar la ficha:", error);
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
            <h2 className="text-2xl font-medium dark:text-white">Agregar una ficha</h2>
            <p className='text-gray-500'>Completa la información para agregar una nueva ficha.</p>
          </div>
        </div>

        {/* Contenedor principal con grid para dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label htmlFor="number" className="block mb-2 dark:text-white font-medium">Ficha:</label>
              <input
                type="number"
                id="number"
                placeholder="Ficha"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className={`block w-full p-2 border ${errors.number ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              />
              {errors.number && <p className="text-red-500">{errors.number}</p>}
            </div>
            <div>
              <label htmlFor="end_lective" className="block mb-2 dark:text-white font-medium">Fecha de finalización:</label>
              <input
                type="date"
                id="end_Lective"
                value={end_lective}
                onChange={(e) => setEndLective(e.target.value)}
                className={`block w-full p-2 border ${errors.endLective ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              />
              {errors.endLective && <p className="text-red-500">{errors.endLective}</p>}
            </div>

            <div>
              <label htmlFor="journey" className="block mb-2 dark:text-white font-medium">Jornada:</label>
              <select
                id="journey"
                value={journey}
                onChange={(e) => setJourney(e.target.value)}
                className={`block w-full p-2.5 border ${errors.journey ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Seleccionar</option>
                {journeys.map((journey) => (
                  <option key={journey.id} value={journey.id}>
                    {journey.name}
                  </option>
                ))}
              </select>
              {errors.journey && <p className="text-red-500">{errors.journey}</p>}
            </div>
          </div>
          {/* Columna derecha */}
          <div className="space-y-4">
          <div>
              <label htmlFor="start_lective" className="block mb-2 dark:text-white font-medium">Fecha de inicio:</label>
              <input
                type="date"
                id="start_Lective"
                value={start_lective}
                onChange={(e) => setStartLective(e.target.value)}
                className={`block w-full p-2 border ${errors.startLective ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              />
              {errors.startLective && <p className="text-red-500">{errors.startLective}</p>}
            </div>
            <div>
              <label htmlFor="program" className="block mb-2 dark:text-white font-medium">Programa:</label>
              <select
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className={`block w-full p-2.5 border ${errors.program ? 'border-red-500' : 'border-custom-blues'} rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Seleccionar</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              {errors.program && <p className="text-red-500">{errors.program}</p>}
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado de la ficha:</label>
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
        </div>

        <div className="flex items-center justify-end p-4 space-x-2 border-t border-custom-blues">
        <button
            type="button"
            className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            onClick={handleSave}
          >
            <FiSave className="mr-2" />
            Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSheet;


