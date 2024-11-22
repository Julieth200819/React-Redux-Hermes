"use client";
import TableComponent from '@/app/components/table';
import React, { useEffect, useState, useMemo } from 'react';
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import { adminSidebarItems } from '../../../components/items';
import AddCoordinations from "@/app/components/Modals/Coordinations/addCoordination";
import EditCoordinations from "../../../components/Modals/Coordinations/editCoordination";
import trainingCentersService from "@/app/services/trainingCentersService";
import LoadingSpinner from '../../../components/loadingSpinner';
import ConfirmationModal from "@/app/components/delete";
import coordinationService from "@/app/services/coordinationService";
import Notification, { notifySuccess, notifyError } from '../../../components/notification';

export default function CoordinationsView(){
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [coordinations, setCoordinations] = useState([]);
    const [selectedCoordinationId, setSelectedCoordinationId] = useState(null);
    const [coordinationToDelete, setCoordinationToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para abrir/cerrar el modal de confirmación
    const [loading, setLoading] = useState(true);

    const handleCloseModal = () => {
        setIsOpenModal(null);
        fetchCoordinations();
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        fetchCoordinations();
    };

    const openDeleteModal = (coordination) => {
        setCoordinationToDelete(coordination); 
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCoordinationToDelete(null); // Limpiar el estado
    };
    

    const handleDeleteCoordination = async () => {
        try {
            await coordinationService.deleteCoordination(coordinationToDelete.id); // Llama al servicio de eliminación
            setCoordinations((prevCoord) => prevCoord.filter((coord) => coord.id !== coordinationToDelete.id)); // Actualiza el estado
            notifySuccess('Coordinacion eliminada exitosamente');
            closeDeleteModal();
        } catch (error) {
            notifyError('Error al eliminar la coordinacion');
        }
    };

    const renderActions = (coordination) => (
        <div className="flex space-x-2">
            <HiPencilAlt
                className="w-5 h-5 cursor-pointer text-custom-blues"
                onClick={() => {
                    if (coordination) {
                        handleOpenModal('Edit', coordination.id); // Envía el ID directamente
                    } else {
                        console.error('Error: coordination es undefined:', coordination);
                    }
                }}
            />
            <FaRegTrashAlt
                className="w-5 h-5 cursor-pointer text-red-500"
                onClick={() => openDeleteModal(coordination)}
            />
        </div>
    );

    const handleOpenModal = (modalType, id = null) => {
        if (modalType === 'Edit') {
            if (id) {
                setSelectedCoordinationId(id);
                console.log("Coordinación a editar:", id);
            } else {
                console.warn("Advertencia: id es null o undefined en handleOpenModal.");
            }
            
            setIsOpenModal(modalType);
        }
    };
    
    const fetchCoordinations = async () => {
        setLoading(true);
        try {
            const response = await coordinationService.getAll();
            //console.log("Datos de coordinaciones:", response.data);
            
            // Verificar si es un objeto y no un array
            const coordinationData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
            
            const centerResponse = await trainingCentersService.getAll();
            const centerData = centerResponse.data.data;
            console.log("Datos de centros de formación:", centerData);
    
            const formattedData = coordinationData.map(item => {
                const TrainingCenterName = item.trainingCenterDTO ? item.trainingCenterDTO.name : "Sin centro de formación";
                const trainingCenterid=item.trainingCenterDTO?item.trainingCenterDTO.id:"Sin centro de formacion";
                console.log("@@@@@@1 ",trainingCenterid);
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    state: item.state ? "Activo" : "Inactivo",
                    training_center: TrainingCenterName,
                    training_center_id:trainingCenterid,
                };
            });
            
            
            console.log("Coordinaciones obtenidas:", formattedData);
            setCoordinations(formattedData);
        } catch (error) {
            console.error("Error al obtener coordinaciones:", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };
    
    useEffect(() => {
        fetchCoordinations();
    }, []);
    
    // Usar useMemo para memorizar las columnas
    const columns = useMemo(() => [
        { key: 'name', title: 'Nombre' },
        { key: 'description', title: 'Descripción' },
        { key: 'state', title: 'Estado' },
        { key: 'training_center', title: 'Centro de formación' },
        { key: 'action', title: 'Acciones' },
    ], []);

    return (
        <> <Notification/>
            {loading ? (
                <LoadingSpinner />
            ) : (
               
                   
                    <div className="xl:col-span-5">
                        <TableComponent
                            columns={columns}
                            data={coordinations}
                            title="Coordinaciones"
                            showButton={true}
                            buttonText="Agregar coordinación"
                            OpenModalAdd={openAddModal}
                            renderActions={renderActions}
                        />
                        {isOpenModal === 'Edit' && (
                            <EditCoordinations 
                                isOpen={isOpenModal === 'Edit'} 
                                onClose={handleCloseModal} 
                                coordinationId={selectedCoordinationId} 
                                fetchCoordinations={fetchCoordinations}
                            />
                        )}
                        <AddCoordinations 
                            isOpen={isAddModalOpen} 
                            onClose={closeAddModal} 
                            fetchCoordinations={fetchCoordinations} 
                        />
                        <ConfirmationModal
                              isOpen={isDeleteModalOpen}
                              onClose={closeDeleteModal}
                              onConfirm={handleDeleteCoordination}
                              title={`¿Está seguro que desea eliminar esta coordinacion?`}
                          />
                    </div>
              
            )}
        </>
    );
};
