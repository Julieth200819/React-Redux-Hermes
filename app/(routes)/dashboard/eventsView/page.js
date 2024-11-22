"use client";
import React, { useEffect, useState } from 'react';
import TableComponent from '@/app/components/table';
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import EventService from '@/app/services/eventService';
import environmentsService from '@/app/services/environmentsService';
import LoadingSpinner from '../../../components/loadingSpinner'
import EditEvent from "@/app/components/Modals/EventsModals/editEvents";
import AddEvents from "@/app/components/Modals/EventsModals/addEvents";
import ConfirmationModal from '@/app/components/delete';
import coordinationService from '@/app/services/coordinationService';
import Notification, { notifySuccess, notifyError } from '../../../components/notification';

 export default function EventsView() {
    const [events, setEvents] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Función para cargar eventos junto con sus coordinaciones y ambientes
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const eventResponse = await EventService.getAll();
            const eventData = Array.isArray(eventResponse.data.data) ? eventResponse.data.data : [eventResponse.data.data];

            const coordinationResponse = await coordinationService.getAll();
            const coordinationData = coordinationResponse.data.data;

            const environmentResponse = await environmentsService.getAll();
            const environmentData = environmentResponse.data.data;

            const formattedData = eventData.map(event => {
                const coordinationId = event.coordination ? event.coordination.id : null;
                const coordinationFind = coordinationId ? coordinationData.find(c => c.id === coordinationId) : null;
                const environmentId = event.environment ? event.environment.id : null;
                const environmentFind = environmentId ? environmentData.find(env => env.id === environmentId) : null;

                return {
                    id: event.id,
                    event_name: event.name,
                    coordination: coordinationFind ? coordinationFind.name : 'Sin coordinación',
                    environment: environmentFind ? environmentFind.name : 'Sin ambiente',
                    date_event: event.startDate || 'Fecha no disponible',
                    start_event: event.startHour || 'Hora no disponible',
                    finish_event: event.endHour || 'Hora no disponible',
                    state_event: event.state || 'Estado no disponible',
                    actions: renderActions(event),
                };
            });

            setEvents(formattedData);
        } catch (error) {
            console.error('Error fetching events, coordinations, and environments:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
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

    // Modal de confirmación de eliminación
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
            await EventService.deleteEvent(eventToDelete.id); // Llama al servicio de eliminación
            setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventToDelete.id)); // Actualiza el estado
            notifySuccess('Evento eliminado exitosamente');
            closeDeleteModal();
        } catch (error) {
            notifyError('Error al eliminar el evento');
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
        { key: 'state_event', title: 'Estado' },
        { key: 'actions', title: 'Acciones' },
    ];

    return (
        <> {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="xl:col-span-5">
                <Notification/>
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

                {/* Modal de Confirmación de Eliminación */}
                <ConfirmationModal
                            isOpen={isDeleteModalOpen}
                            title={`¿Está seguro que desea eliminar este evento?`}
                            onConfirm={handleDeleteEvent}
                            onClose={closeDeleteModal}
                        />
            </div>
          )};
        </>
    );
};