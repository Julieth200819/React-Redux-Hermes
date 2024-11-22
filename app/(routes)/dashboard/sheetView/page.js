"use client";
import TableComponent from '@/app/components/table';
import React, { useState, useEffect } from 'react';
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import EditSheet from "@/app/components/Modals/SheetModal/editSheet";
import AddSheet from "@/app/components/Modals/SheetModal/addSheet";
import journeyService from "@/app/services/journeyService";
import LoadingSpinner from '../../../components/loadingSpinner';
import ConfirmationModal from '@/app/components/delete';
import sheetService from "@/app/services/sheetService";
import programService from "@/app/services/programService";
import Notification, { notifySuccess, notifyError } from '../../../components/notification';


export default function SheetsView({ columns: initialColumns }) {
  const [isOpenModal, setIsOpenModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sheet, setSheet] = useState([]);
  const [sheetToDelete, setSheetToDelete] = useState(null);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const renderActions = (item, sheet) => (
    <div className="flex space-x-2">
      <HiPencilAlt
        className="w-5 h-5 cursor-pointer text-custom-blues"
        onClick={() => handleOpenModal('Edit', item.id)}
      />
      <FaRegTrashAlt
        className="w-5 h-5 cursor-pointer text-red-500"
        onClick={() => handleOpenModal('Eliminar', item)}
        
      />
    </div>
  );

  const handleOpenModal = (modalType, id = null) => {
    if (modalType === 'Edit') {
      setSelectedSheetId(id);  // Guarda el ID de la ficha seleccionada
    }
    if (modalType === 'Eliminar') {
      setSheetToDelete(id);
      setIsDeleteModalOpen(true);
    }
    setIsOpenModal(modalType);
  };

  const handleCloseModal = () => {
    setIsOpenModal(null);
    setSheetToDelete(null);
    fetchSheets();
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSheetToDelete(null);
  }

  const handleDeleteSheet = async () => {
    if (!sheetToDelete || !sheetToDelete.id) {
      notifyError("Ficha no encontrada para eliminar");
      closeDeleteModal();
      return;
    }
    try {
      await sheetService.deleteStudySheet(sheetToDelete.id);
      setSheet((prevSheet) => prevSheet.filter((sheet) => sheet.id !== sheetToDelete.id));
      closeDeleteModal();
      notifySuccess("Ficha eliminada exitosamente");
    } catch (error) {
      notifyError("Error al eliminar la ficha");
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    fetchSheets();
    // notifySuccess("Ficha agregada exitosamente");
  };

  const columns = initialColumns || [
    { key: 'number', title: 'Ficha' },
    { key: 'startLective', title: 'Fecha de inicio' },
    { key: 'endLective', title: 'Fecha final' },
    { key: 'state', title: 'Estado' },
    { key: 'program', title: 'Programa' },
    { key: 'journey', title: 'Jornada' },
    { key: 'action', title: 'Acciones' },
  ];

  const fetchSheets = async () => {
    setLoading(true);
    try {
      const response = await sheetService.getAll();
      const studySheetData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      const programResponse = await programService.getAll();

      const programData = programResponse.data.data;
      const journeyResponse = await journeyService.getAll();

      const journeyData = journeyResponse.data.data;
      console.log("Datos de jornadas:", journeyData);

      const formattedData = studySheetData.map(item => {
        const program = programData.find(p => p.id === item.program.id);
        const journey = journeyData.find(j => j.id === item.journey.id);

        return {
          id: item.id,
          number: item.number,
          startLective: item.startLective,
          endLective: item.endLective,
          state: item.state ? "Activo" : "Inactivo",
          program: program ? program.name : "Sin programa",
          journey: journey ? journey.name : "Sin jornada",
        };
      });

      console.log("Datos formateados:", formattedData);
      setSheet(formattedData);
    } catch (error) {
      console.error("Error al obtener las fichas, programas o jornadas:", error);
    } finally {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);


  return (
     <> <Notification />
    {loading ? (
          <LoadingSpinner />
        ) : (
      <div className="xl:col-span-5">
          <TableComponent
            columns={columns}
            data={sheet}
            title="Fichas"
            showButton={true}
            buttonText="Agregar ficha"
            OpenModalAdd={openAddModal}
            renderActions={renderActions}
            loading={loading}
          />
        {isOpenModal === 'Edit' && (
          <EditSheet isOpen={isOpenModal === 'Edit'} onClose={handleCloseModal} sheetId={selectedSheetId} />
        )}

       {/* Modal de Confirmación de Eliminación */}
       <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title={`¿Está seguro que desea eliminar esta ficha?`}
          onConfirm={handleDeleteSheet}
          onClose={closeDeleteModal}
        />
        <AddSheet isOpen={isAddModalOpen} onClose={closeAddModal} fetchSheets={fetchSheets} />
      </div>
    )}
    </>
  );
}