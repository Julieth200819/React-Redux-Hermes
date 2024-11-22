"use client";
import React, { useEffect, useState } from "react";
import TableComponent from "@/app/components/table";
import { HiPencilAlt } from "react-icons/hi";
import environmentService from "@/app/services/environmentsService";
import coordinationService from "@/app/services/coordinationService";
import HeadquarterService from "@/app/services/headquarterService";
import { FaRegTrashAlt } from "react-icons/fa";
import LoadingSpinner from '../../../components/loadingSpinner'
import EditEnvironments from "@/app/components/Modals/Environment/editEnvironment";
import AddEnvironments from "@/app/components/Modals/Environment/addEnvironment";
import ConfirmationModal from "@/app/components/delete";
import { env } from "process";
import Notification, { notifySuccess, notifyError } from '../../../components/notification';

export default function EnvironmentsView() {
  const [environments, setEnvironments] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [environmentToEdit, setEnvironmentToEdit] = useState(null);
  const [enviromentToDelete, setEnviromentToDelete] = useState(null); // para almacenar la referencia temporal del ambiente
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para abrir/cerrar el modal de confirmación
  const [loading, setLoading] = useState(false);

  // Función para manejar el evento de eliminar un ambiente
  const handleDeleteEnviroment = async () => {
    try {

      await environmentService.removeEnvironment(enviromentToDelete.id);
      setEnvironments((prevEnviroments) => prevEnviroments.filter(env => env.id !== enviromentToDelete.id));

      notifySuccess("ambiente eliminado exitosamente");
      closeDeleteModal();

    } catch (e) {
      notifyError("Error al eliminar ambiente");  
      console.log("error al elminar ambiente: ", e);
    }
  }

  // Función para cargar ambientes junto con sus coordinaciones y sedes
  const fetchEnvironments = async () => {
    setLoading(true);
    try {
      const environmentResponse = await environmentService.getAll();
      const environmentData = Array.isArray(environmentResponse.data.data)
        ? environmentResponse.data.data
        : [environmentResponse.data.data];

      const coordinationResponse = await coordinationService.getAll();
      const coordinationData = coordinationResponse.data.data;

      const headquarterResponse = await HeadquarterService.getAll(); // Llamar método estático
      const headquarterData = headquarterResponse.data.data;

      const formattedData = environmentData.map((env) => {
        const coordinationId = env.coordination.id;
        const coordinationFind = coordinationData.find(
          (c) => c.id === coordinationId
        );
        const headquarterId = env.headquarter.id;
        const headquarterFind = headquarterData.find(
          (hq) => hq.id === headquarterId
        );

        return {
          id: env.id,
          name: env.name,
          description: env.description,
          floor: env.floor,
          capacity: env.capacity,
          state: env.state ? "Activo" : "Inactivo",
          coordination: coordinationFind
            ? coordinationFind.name
            : "Sin coordinación",
          headquarter: headquarterFind ? headquarterFind.name : "Sin sede",
          actions: renderActions(env),
        };
      });

      setEnvironments(formattedData);
    } catch (error) {
      console.error("Error fetching environments:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // Manejadores de Modal
  const handleOpenModal = (modalType, id = null) => {

    if (modalType === "Editar") {
      const enviromentToEdit = environments.find((env) => env.id === id);

      if (enviromentToEdit) {

        setEnvironmentToEdit(enviromentToEdit);

      } else {
        console.warn("no se encontró el ambiente con el id especificado");
      }


      setIsOpenModal(modalType);
    }

  };

  const handleCloseModal = () => {
    setIsOpenModal(null);
    setEnvironmentToEdit(null);

  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);

  };


  const openDeleteModal = (enviroment) => {
    setEnviromentToDelete(enviroment);
    setIsDeleteModalOpen(true);
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEnviromentToDelete(null); // Limpiar el estado
  };


  // Renderizar acciones en la tabla
  const renderActions = (env) => (
    <div className="flex space-x-2">
      <HiPencilAlt
        className="w-5 h-5 cursor-pointer text-custom-blues"
        onClick={() => {
          setEnvironmentToEdit(env);
          handleOpenModal("Editar");
        }}
      />

      <FaRegTrashAlt
        className="w-5 h-5 cursor-pointer text-red-500"
        onClick={() => openDeleteModal(env)}
      />
    </div>
  );

  // Fetch de ambientes, coordinaciones y sedes al cargar el componente
  useEffect(() => {
    fetchEnvironments();
  }, []);

  const columns = [
    { key: "name", title: "Nombre" },
    { key: "description", title: "Descripción" },
    { key: "floor", title: "Piso" },
    { key: "capacity", title: "Capacidad" },
    { key: "coordination", title: "Coordinación" },
    { key: "headquarter", title: "Sede" },
    { key: "state", title: "Estado" },
    { key: "actions", title: "Acciones" },
  ];

  return (
    <> <Notification/>
      {loading ? (
          <LoadingSpinner />
        ) : (
        <div className="xl:col-span-5">
          <TableComponent
            columns={columns}
            data={environments}
            title="Ambientes"
            showButton={true}
            buttonText="Agregar ambiente"
            OpenModalAdd={openAddModal}
          />
          {isOpenModal === "Editar" && (
            <EditEnvironments
              isOpen={isOpenModal === "Editar"}
              onClose={handleCloseModal}
              environmentToEdit={environmentToEdit}
              fetchEnvironments={fetchEnvironments}
            />
          )}
          <AddEnvironments
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            fetchEnvironments={fetchEnvironments}
          />

          
        {/* Modal de confirmación de eliminación */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteEnviroment}
            title={`¿Está seguro que desea eliminar este ambiente?`}
          />
        
        </div>
      )}
    </>
  );
}
