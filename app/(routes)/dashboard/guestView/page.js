"use client";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import eventService from "@/app/services/eventService";
import LoadingSpinner from '../../../components/loadingSpinner';
import coordinationService from "@/app/services/coordinationService";
import environmentsService from "@/app/services/environmentsService";

export default function GuestView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda
  const eventsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAll();

        if (response && response.data.data) {
          const eventList = response.data.data;

          const eventsWithDetails = await Promise.all(
            eventList.map(async (event) => {
              const coordinationResponse = await coordinationService.getById(event.coordination.id);
              const environmentResponse = await environmentsService.getById(event.environment.id);

              const coordinationName = coordinationResponse.data.data.name;
              const environmentData = environmentResponse.data.data;
              const environmentName = Array.isArray(environmentData) && environmentData.length > 0
                ? environmentData[0].name
                : environmentData.name;

              return {
                ...event,
                coordination: {
                  ...event.coordination,
                  name: coordinationName,
                },
                environment: {
                  ...event.environment,
                  name: environmentName,
                },
              };
            })
          );

          setEvents(eventsWithDetails);
        } else {
          console.error("La respuesta no tiene una propiedad 'data'.", response);
        }
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      } finally {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
    };

    fetchEvents();
  }, []);

  // Filtrado de eventos según el término de búsqueda
  const filteredEvents = events.filter((event) => {
    const nameMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const coordinationMatch = event.coordination.name.toLowerCase().includes(searchTerm.toLowerCase());
    const environmentMatch = event.environment.name.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || coordinationMatch || environmentMatch;
  });

  // Paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredEvents.length / eventsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!Array.isArray(events) || events.length === 0) {
    return <p className="text-2xl italic text-gray-500 text-center mt-72">No hay eventos disponibles en este momento.</p>;
  }

  return (
    <div className="xl:col-span-5">
      <div className="text-2xl font-medium text-custom-blue text-left lg:text-left mt-12 max-w-full mx-auto px-2 sm:px-6 lg:px-8 w-full lg:w-3/4">
        Detalles de eventos
      </div>
      
      {/* Barra de búsqueda */}
      <div className="relative w-full flex justify-center">
        <div className="relative w-full sm:w-64">
          <CiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
            size={24}
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualizar término de búsqueda
            className="pl-12 p-2 bg-custom-blue placeholder-white rounded-lg w-full h-8 text-white"
          />
        </div>
      </div>

      {/* Contenedor principal para eventos y paginación */}
      <div className="flex flex-col min-h-screen items-center">
        {/* Lista de eventos obtenidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-center">
          {currentEvents.map((event) => (
            <div key={event.id} className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
              <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">
                {event.name}
              </h2>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="text-gray-600">
                  <h4>Coordinación:</h4>
                  <p className="font-bold">{event.coordination.name}</p>
                  <h4>Fecha de inicio:</h4>
                  <p className="font-bold">{event.startDate}</p>
                  <h4>Hora de inicio:</h4>
                  <p className="font-bold">{event.startHour}</p>
                  <h4>Estado del evento:</h4>
                  <p className="font-bold">{event.state}</p>
                </div>
                <div className="text-gray-600">
                  <h4>Ambiente:</h4>
                  <p className="font-bold">{event.environment.name}</p>
                  <h4>Fecha de finalización:</h4>
                  <p className="font-bold">{event.endDate}</p>
                  <h4>Hora de finalización:</h4>
                  <p className="font-bold">{event.endHour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="fixed bottom-4 rounded-lg p-2  flex items-center justify-center w-64">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg mx-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-custom-blue text-white"}`}
          >
            Anterior
          </button>
          <span className="px-4 py-2">Página {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(filteredEvents.length / eventsPerPage)}
            className={`px-4 py-2 rounded-lg mx-2 ${currentPage >= Math.ceil(filteredEvents.length / eventsPerPage) ? "bg-gray-300 cursor-not-allowed" : "bg-green text-white"}`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
