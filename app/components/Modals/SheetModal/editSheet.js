"use client";
import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import StudySheetService from '@/app/services/sheetService';
import programService from '@/app/services/programService';
import journeyService from '@/app/services/journeyService';
import sheetService from '@/app/services/sheetService';
import { notifySuccess, notifyError } from '../../../components/notification';

const EditSheet = ({ isOpen, onClose, sheetId }) => {
  const [startLective, setStartLective] = useState('');
  const [endLective, setEndLective] = useState('');
  const [state, setState] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [programId, setProgramId] = useState('');
  const [journeyId, setJourneyId] = useState('');
  const [programs, setPrograms] = useState([]);
  const [journeys, setJourneys] = useState([]);

  // Función para cargar datos de la ficha
  const fetchSheetData = async (id) => {
    try {
      const response = await StudySheetService.getById(id);
      const sheet = response.data.data;

      setNumber(sheet.number);
      setStartLective(sheet.startLective);
      setEndLective(sheet.endLective);
      setState(sheet.state);
      
      // Establecer los valores seleccionados previamente para programa y jornada
      setProgramId(sheet.program.id);
      setJourneyId(sheet.journey.id);
    } catch (error) {
      console.error("Error al obtener la ficha:", error);
    }
  };

  // Cargar programas y jornadas
  const fetchProgramsAndJourneys = async () => {
    try {
      const programResponse = await programService.getAll();
      const journeyResponse = await journeyService.getAll();

      setPrograms(programResponse.data.data || []);
      setJourneys(journeyResponse.data.data || []);
    } catch (error) {
      console.error('Error al cargar programas y jornadas:', error);
    }
  };

  useEffect(() => {
    if (isOpen && sheetId) {
      fetchSheetData(sheetId);
    }
    fetchProgramsAndJourneys();
  }, [isOpen, sheetId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const putStudySheet = {
        data: {
          number: number,
          start_lective: startLective,
          end_lective: endLective,
          state: state,
          program: programId,
          journey: journeyId,
        }
      };

      await sheetService.putStudySheet(sheetId, putStudySheet);
      notifySuccess('Ficha actualizada con éxito');
      onClose();
    } catch (error) {
      console.error("Error al guardar la hoja:", error);
      notifyError('Error al actualizar la ficha');
    } finally {
      setLoading(false);
      
    }
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
            <h2 className="text-2xl font-medium dark:text-white">Editar la ficha</h2>
            <p className='text-gray-500'>Actualiza la información de la ficha seleccionada.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Contenido de la izquierda */}
          <div className="space-y-4">
            <div>
              <label htmlFor="number" className="block mb-2 dark:text-white font-medium">Ficha:</label>
              <input
                type="text"
                id="number"
                placeholder="Ficha"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="block w-full p-2 border border-custom-blues rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="startLective" className="block mb-2 dark:text-white font-medium">Fecha de inicio:</label>
              <input
                type="date"
                id="startLective"
                value={startLective}
                onChange={(e) => setStartLective(e.target.value)}
                className="block w-full p-2 border border-custom-blues rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="journey" className="block mb-2 dark:text-white font-medium">Jornada:</label>
              <select
                id="journey"
                value={journeyId}
                onChange={(e) => setJourneyId(e.target.value)}
                className="block w-full p-2 border border-custom-blues rounded-lg"
              >
                <option value="">Selecciona la jornada</option>
                {journeys.map((journey) => (
                  <option key={journey.id} value={journey.id}>{journey.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Contenido de la derecha */}
          <div className="space-y-4">
            <div>
              <label htmlFor="endLective" className="block mb-2 dark:text-white font-medium">Fecha de finalización:</label>
              <input
                type="date"
                id="endLective"
                value={endLective}
                onChange={(e) => setEndLective(e.target.value)}
                className="block w-full p-2 border border-custom-blues rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="program" className="block mb-2 dark:text-white font-medium">Programa:</label>
              <select
                id="program"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="block w-full p-2 border border-custom-blues rounded-lg"
              >
                <option value="">Selecciona el programa</option>
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>{prog.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 dark:text-white font-medium">Estado de la ficha:</label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="block w-full p-2.5 border border-custom-blues rounded-lg"
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
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

export default EditSheet;
