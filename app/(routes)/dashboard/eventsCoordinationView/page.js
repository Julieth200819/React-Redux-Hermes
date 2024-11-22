"use client";
import React, { useEffect, useState } from 'react';
import TableComponent from '@/app/components/table';
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import EventService from '@/app/services/eventService';
import CoordinationService from '@/app/services/coordinationService';
import environmentsService from '@/app/services/environmentsService'; 
import EditEvent from "@/app/components/Modals/EventsModals/editEvents";
import AddEvents from "@/app/components/Modals/EventsModals/addEvents";

export default function EventsCoordinationView() {
    const [events, setEvents] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [, setIsDeleteModalOpen] = useState(false);

    // Función para cargar eventos junto con sus coordinaciones y ambientes
    const fetchEvents = async () => {
        try {
            // Obtener todos los eventos
            const eventResponse = await EventService.getAll();
            const eventData = Array.isArray(eventResponse.data.data) ? eventResponse.data.data : [eventResponse.data.data];

            // Obtener todas las coordinaciones
            const coordinationResponse = await CoordinationService.getAll();
            const coordinationData = coordinationResponse.data.data;

            // Obtener todos los ambientes
            const environmentResponse = await environmentsService.getAll(); // Cambiado a minúsculas
            const environmentData = environmentResponse.data.data;

            // Combinar los eventos con sus respectivas coordinaciones y ambientes
            const formattedData = eventData.map(event => {
                const coordination = coordinationData.find(c => c.id === event.coordinationId);
                const environment = environmentData.find(env => env.id === event.environmentId); // Asegúrate de tener environmentId en el evento

                return {
                    id: event.id,
                    event_name: event.name,
                    coordination: coordination ? coordination.name : 'Sin coordinación',
                    environment: environment ? environment.name : 'Sin ambiente',
                    date_event: event.startDate,
                    start_event: event.startHour,
                    finish_event: event.endHour,
                    actions: renderActions(event),
                };
            });

            setEvents(formattedData);
        } catch (error) {
            console.error('Error fetching events, coordinations, and environments:', error);
        }
    };

    // Manejadores de Modal
    const handleOpenModal = (modalType) => setIsOpenModal(modalType);
    const handleCloseModal = () => {
        setIsOpenModal(null);
        setEventToEdit(null);
    };
    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    // Manejo de eliminación
    const openDeleteModal = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
    };

    const handleDeleteEvent = async () => {
        try {
            await EventService.deleteEvent(eventToDelete.id);
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete.id));
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    // Renderizar acciones en la tabla
    const renderActions = (event) => (
        <div className="flex space-x-2">
            <HiPencilAlt
                className="w-5 h-5 cursor-pointer text-custom-blues"
                onClick={() => {
                    setEventToEdit(event);
                    handleOpenModal('Editar');
                }}
            />
            <FaRegTrashAlt
                className="w-5 h-5 cursor-pointer text-red-500"
                onClick={() => openDeleteModal(event)}
            />
        </div>
    );

    // Fetch de eventos, coordinaciones y ambientes al cargar el componente
    useEffect(() => {
        fetchEvents();
    }, []);

    const columns = [
        { key: 'event_name', title: 'Nombre del evento' },
        { key: 'coordination', title: 'Coordinación' },
        { key: 'environment', title: 'Ambiente' },
        { key: 'date_event', title: 'Fecha' },
        { key: 'start_event', title: 'Hora inicio' },
        { key: 'finish_event', title: 'Hora fin' },
        { key: 'actions', title: 'Acciones' },
    ];

    return (
            <div className="xl:col-span-5">
                <TableComponent
                    columns={columns}
                    data={events}
                    title="Eventos"
                    showButton={true}
                    buttonText="Agregar evento"
                    OpenModalAdd={openAddModal}
                />
                {isOpenModal === 'Editar' && (
                    <EditEvent 
                        isOpen={isOpenModal === 'Editar'} 
                        onClose={handleCloseModal} 
                        eventToEdit={eventToEdit} 
                        fetchEvents={fetchEvents}  
                    />
                )}
                <AddEvents 
                    isOpen={isAddModalOpen} 
                    onClose={closeAddModal} 
                    fetchEvents={fetchEvents}  
                />
            </div>
    );
};