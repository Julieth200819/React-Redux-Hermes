"use client";
import TableComponent from '@/app/components/table';
import React, { useEffect, useState } from 'react';
import { HiPencilAlt } from "react-icons/hi";
import LoadingSpinner from '../../../components/loadingSpinner'
import EditEquipment from "@/app/components/Modals/Equipment/editEquipment";
import AddEquipment from "@/app/components/Modals/Equipment/addEquipment";
import peopleService from '@/app/services/peopleService';
import equipmentService from '@/app/services/equipmentService';
import e from 'cors';

export default function MovementsView() {
    const [equipmentData, setEquipmentData] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [equipmentToEdit, setEquipmentToEdit] = useState(null);
    const [equipmentToDelete, setEquipmentToDelete] = useState(null);
    const [setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchEquipment = async () => {
        setLoading(true);
        try {
            const equipmentResponse = await equipmentService.getAll();
            const { data: { data: equipmentData = [] } } = equipmentResponse;
            console.log('API response (Equipos):', equipmentResponse);


            const personResponse = await peopleService.getAll();
            const { data: { data: personData = [] } } = personResponse;
            console.log('Person data:', personResponse);

            const formattedEquipmentData = equipmentData.map(equipment => {
                const personId = equipment.person_id?.id;
                const personFind = personData.find(p => p.id === personId);

                return {
                    id: equipment.id,
                    serial: equipment.serial || 'Sin serial',
                    brand: equipment.brand || 'Sin marca',
                    model: equipment.model || 'Sin modelo',
                    color: equipment.color || 'Sin color',
                    state: equipment.state ? 'Activo' : 'Inactivo',
                    person: equipment ? `${personFind.name} ${personFind.lastname}` : 'Sin persona',
                    actions: renderActions(equipment),
                };
            });

            setEquipmentData(formattedEquipmentData);
            console.log('Formatted equipment data:', formattedEquipmentData);
        } catch (error) {
            console.error("Error al obtener equipos:", error);
        }finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const handleOpenModal = (modalType, equipment) => {
        setEquipmentToEdit(equipment); 
        console.log(equipment);// Asignamos el equipo completo
        setIsOpenModal(modalType);
    };
    console.log("Aqui esta el equipo para editar 1", equipmentData);
    
    const handleCloseModal = () => {
        setIsOpenModal(null);
        setEquipmentToEdit(null);
    };

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const renderActions = (equipment) => (
        <div className="flex space-x-2"> 
            <HiPencilAlt
                className="w-5 h-5 cursor-pointer text-custom-blues"
                onClick={() => {handleOpenModal("Editar", equipment), console.log("ESte es el item", equipment.id)}}
            />
        </div>
    );
    useEffect(() => {
        fetchEquipment();
    }, []);

    const equipmentColumns = [
        { key: 'brand', title: 'Marca' },
        { key: 'serial', title: 'Serial' },
        { key: 'person', title: 'Nombre' },
        { key: 'model', title: 'Modelo' },
        { key: 'color', title: 'Color' },
        { key: 'state', title: 'Estado' },
        { key: 'actions', title: 'Detalles' },
    ];

    return (
        <>
        {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="xl:col-span-5">
                <TableComponent
                    columns={equipmentColumns}
                    data={equipmentData.map(equipment => ({
                        ...equipment,
                        actions: renderActions(equipment),
                    }))}
                    title="Equipos"
                    showButton={true}
                    buttonText="Agregar equipo"
                    OpenModalAdd={openAddModal}
                />

            <EditEquipment
                isOpen={isOpenModal === 'Editar'}
                onClose={handleCloseModal}
                equipmentToEdit={equipmentToEdit} // Enviamos el equipo completo
                fetchEquipment={fetchEquipment}
            />

                <AddEquipment
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    fetchEquipment={fetchEquipment}
                />
            </div>
          )}
        </>
    );
};
