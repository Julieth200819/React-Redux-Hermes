'use client'
import TableComponent from '@/app/components/table';
import React, { useState, useEffect } from 'react';
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import AddJourney from '@/app/components/Modals/Journey/addJourney';
import journeyService from "@/app/services/journeyService";
import EditJourney from '@/app/components/Modals/Journey/editJourney';
import ConfirmationModal from "@/app/components/delete";
import LoadingSpinner from '../../../components/loadingSpinner'
import Notification, { notifySuccess, notifyError } from '../../../components/notification';

export default function JourneyView() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [journey, setJourney] = useState([]);
    const [journeyToDelete, setJourneyToDelete] = useState(null);
    const [journeyToEdit, setJourneyToEdit] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchJourney = async () => {
        setLoading(true);
        try {
            const journeyResponse = await journeyService.getAll();

            const journeyData = Array.isArray(journeyResponse.data.data) ? journeyResponse.data.data : [journeyResponse.data.data];

            const formattedData = journeyData.map((item) => ({
                id: item.id,
                name: item.name,
                state: item.state === true ? 'Activo' : 'Inactivo',
                actions: renderActions(item, item)
            }));

            console.log("Datos formateados: ", formattedData);
            setJourney(formattedData);
        } catch (error) {
            console.error("Error al obtener jornadas: ", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const renderActions = (item) => (
        <div className="flex space-x-2">
            <HiPencilAlt
                className="w-5 h-5 cursor-pointer text-custom-blues"
                onClick={() => {handleOpenModal('Editar', item.id), console.log("ESte es el id", item.id)} } // Pasamos el objeto completo `item`
            />
            <FaRegTrashAlt
                className="w-5 h-5 cursor-pointer text-red-500"
                onClick={() => handleOpenModal('Eliminar', item)} // Pasamos el objeto completo `item`
            />
        </div>
    );
    
    const handleOpenModal = (modalType, journey) => {
        if (modalType === 'Editar' && journey) {
            setJourneyToEdit(journey);
        }
        if (modalType === 'Eliminar') {
            setJourneyToDelete(journey); // Ahora pasamos el objeto completo, no solo el ID
            setIsDeleteModalOpen(true);
        }
        setIsOpenModal(modalType);
    };

    const handleCloseModal = () => {
        setIsOpenModal(null);
        setJourneyToDelete(null);
        fetchJourney(); 
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setJourneyToDelete(null);
      }
      const handleDeleteJourney = async () => {
        if (!journeyToDelete || !journeyToDelete.id) {
            notifyError("Jornada no encontrada para eliminar");
            closeDeleteModal();
            return;
        }
        try {
            await journeyService.deleteJourney(journeyToDelete.id);
            setJourney((prevJourney) => prevJourney.filter((journey) => journey.id !== journeyToDelete.id));
            closeDeleteModal();
            notifySuccess("Jornada eliminada exitosamente");
        } catch (error) {
            notifyError("Error al eliminar la jornada");
        }
    };


    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        fetchJourney(); // Refrescar la lista al cerrar el modal de creación
    };

    const columns = [
        { key: 'name', title: 'Nombre' },
        { key: 'state', title: 'Estado' },
        { key: 'action', title: 'Acciones' }
    ];

    useEffect(() => {
        fetchJourney();
    }, []);

    return (
        <> <Notification/>
        {loading ? (
          <LoadingSpinner />
        ) : (
            (
                    <div className="xl:col-span-5">
                        <TableComponent
                            columns={columns}
                            data={journey}
                            title="Jornadas"
                            showButton={true}
                            buttonText="Agregar Jornada"
                            OpenModalAdd={openAddModal}
                            renderActions={renderActions}
                        />

                        {isOpenModal === 'Editar' && (
                            <EditJourney
                                isOpen={isOpenModal === 'Editar'}
                                onClose={handleCloseModal}
                                journeyToEdit={journeyToEdit}
                                fetchJourney={fetchJourney}
                            />
                        )}

                        {/* Modal de confirmación de eliminación */}
                        {isOpenModal === 'Eliminar' && (
                          <ConfirmationModal
                          isOpen={isDeleteModalOpen}
                          title={`¿Está seguro que desea eliminar esta jornada?`}
                          onConfirm={handleDeleteJourney}
                          onClose={closeDeleteModal}
                        />
                        )}

                        <AddJourney isOpen={isAddModalOpen} onClose={closeAddModal} fetchJourney={fetchJourney} />
                    </div>
            ))}
        </>
    );
};