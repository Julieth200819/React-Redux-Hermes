"use client";
import React, { useEffect, useState } from 'react';
import TableComponent from '@/app/components/table';
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmationModal from '@/app/components/delete';
import EditProgram from "@/app/components/Modals/Program/editProgram";
import AddProgram from "@/app/components/Modals/Program/addProgram";
import LoadingSpinner from '../../../components/loadingSpinner'
import programService from '@/app/services/programService';
import coordinationService from '@/app/services/coordinationService';
import Notification, { notifySuccess, notifyError } from '../../../components/notification';

export default function ProgramView() {
    const [programs, setPrograms] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [programToEdit, setProgramToEdit] = useState(null);
    const [programToDelete, setProgramToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            // Obtener programas
            const programResponse = await programService.getAll();
            console.log('Program response:', programResponse); // Verificar la respuesta completa de la API de programas
            const programData = Array.isArray(programResponse.data.data) ? programResponse.data.data : [programResponse.data.data];
            console.log('Program data array:', programData); // Verificar que programData sea un array
    
            // Obtener coordinaciones
            const coordinationResponse = await coordinationService.getAll();
            console.log('Coordination response:', coordinationResponse); // Verificar la respuesta completa de la API de coordinaciones
            const coordinationData = coordinationResponse.data.data;
            console.log('Coordination data array:', coordinationData); // Verificar que coordinationData sea un array
    
            // Formatear datos de programas
            const formattedData = programData.map(program => {
                const coordinationId = program.coordination?.id;
                const coordinationFind = coordinationData.find(c => c.id === coordinationId);
    
                return {
                    id: program.id,
                    name: program.name,
                    description: program.description,
                    trainingLevel: program.trainingLevel,
                    state: program.state ? "Activo" : "Inactivo",
                    coordination: coordinationFind ? coordinationFind.name : 'Sin coordinación',
                    actions: renderActions(program),
                };
            });
    
            // Establecer los programas formateados en el estado
            setPrograms(formattedData);
            console.log('Formatted program data:', formattedData); 
        } catch (error) {
            console.error('Error fetching programs and coordinations:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };
    
    useEffect(() => {
        fetchPrograms();
    }, []);
    
    // Manejadores de Modal
    const handleOpenModal = (modalType) => setIsOpenModal(modalType);
    const handleCloseModal = () => {
        setIsOpenModal(null);
        setProgramToEdit(null);
    };
    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openDeleteModal = (program) => {
        setProgramToDelete(program);
        setIsDeleteModalOpen(true);
    };
    
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProgramToDelete(null);
    };

    const handleDeleteProgram = async () => {
        try {
            await programService.deleteProgram(programToDelete.id);
            setPrograms(prevPrograms => prevPrograms.filter(program => program.id !== programToDelete.id));
            notifySuccess("Programa eliminado con éxito")
            closeDeleteModal();
        } catch (error) {
            notifyError('Error al eliminar el programa');
        }
    };

    // Renderizar acciones en la tabla
    const renderActions = (program) => (
        <div className="flex space-x-2">
            <HiPencilAlt
                className="w-5 h-5 cursor-pointer text-custom-blues"
                onClick={() => {
                    setProgramToEdit(program);
                    handleOpenModal('Editar');
                }}
            />
            <FaRegTrashAlt
                className="w-5 h-5 cursor-pointer text-red-500"
                onClick={() => openDeleteModal(program)}
            />
        </div>
    );



    const columns = [
        { key: 'name', title: 'Nombre' },
        { key: 'description', title: 'Descripción' },
        { key: 'trainingLevel', title: 'Tipo de formación' },
        { key: 'state', title: 'Estado' },
        { key: 'coordination', title: 'Coordinación' },
        { key: 'actions', title: 'Acciones' },
    ];

    return (
        <> <Notification/>
            {loading ? (
                <LoadingSpinner />
            ) : (
                    <div className="xl:col-span-5">
                        <TableComponent
                            columns={columns}
                            data={programs}
                            title="Programas"
                            showButton={true}
                            buttonText="Agregar programa"
                            OpenModalAdd={openAddModal}
                        />
                        {isOpenModal === 'Editar' && (
                            <EditProgram
                                isOpen={isOpenModal === 'Editar'}
                                onClose={handleCloseModal}
                                programToEdit={programToEdit}
                                fetchPrograms={fetchPrograms}
                            />
                        )}
                        
                        <AddProgram
                            isOpen={isAddModalOpen}
                            onClose={closeAddModal}
                            fetchPrograms={fetchPrograms}
                        />

                          {/* Modal de Confirmación de Eliminación */}
                          <ConfirmationModal
                            isOpen={isDeleteModalOpen}
                            title={`¿Está seguro que desea eliminar este programa?`}
                            onConfirm={handleDeleteProgram}
                            onClose={closeDeleteModal}
                        />
                    </div>
            )}
        </>
    );
};