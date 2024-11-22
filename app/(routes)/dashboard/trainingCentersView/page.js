"use client";
import TableComponent from "@/app/components/table";
import React, { useEffect, useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import AddtrainingCenter from "@/app/components/Modals/traningCenters/addTrainingCenter";
import trainingCentersService from "@/app/services/trainingCentersService";
import LoadingSpinner from '../../../components/loadingSpinner'
import { FaRegTrashAlt } from "react-icons/fa";
import EditTrainingCenter from "@/app/components/Modals/traningCenters/editTrainingCenter";
import ConfirmationModal from "@/app/components/delete";
import Notification, {
  notifySuccess,
  notifyError,
} from "../../../components/notification";

export default function TrainingCentersView() {
  const [activeTab] = useState("listado"); // Estado para controlar la pestaña activa
  const [isOpenModal, setIsOpenModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [center, setCenter] = useState([]); // Estado para almacenar los datos de la API
  const [centerToDelete, setCenterToDelete] = useState(null); // Estado para el centro a eliminar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para abrir/cerrar el modal de confirmación
  const [selectedCenterId, setSelectedCenterId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCloseModal = () => {
    setIsOpenModal(null);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openDeleteModal = (Center) => {
    setCenterToDelete(Center); // Almacenar la persona a eliminar
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCenterToDelete(null); // Limpiar el estado
  };

  const handleDeleteCenter = async () => {
    try {
      await trainingCentersService.deleteTrainingCenter(centerToDelete.id); // Llama al servicio de eliminación
      setCenter((prevCenter) =>
        prevCenter.filter((center) => center.id !== centerToDelete.id)
      ); // Actualiza el estado
      notifySuccess("Centro eliminado exitosamente");
      closeDeleteModal();
    } catch (error) {
      notifyError("Error al eliminar el centro de formación");
    }
  };

  const handleOpenModal = (modalType, id = null) => {
    if (modalType === "Editar") {
      setSelectedCenterId(id); // Guarda el ID de la persona seleccionada
      console.log("centro a editar?" + selectedCenterId);
    }
    setIsOpenModal(modalType);
  };

  // Función para renderizar las acciones en la tabla
  const renderActions = (center, item) => (
    <div className="flex space-x-2">
      <HiPencilAlt
        className="w-5 h-5 cursor-pointer text-custom-blues"
        onClick={() => {
          if (item) {
            handleOpenModal("Editar", item);
          } else {
            console.error("Item is undefined", item);
          }
        }}
      />
      <FaRegTrashAlt
        className="w-5 h-5 cursor-pointer text-red-500"
        onClick={() => openDeleteModal(center)}
      />
    </div>
  );

  // Llamada a la API para obtener los datos de los centros
  const fetchCenters = async () => {
    setLoading(true);
    try {
      const response = await trainingCentersService.getAll();
      console.log("Datos obtenidos de la API:", response.data);

      const centersData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      const formattedData = centersData.map((item) => ({
        id: item.id,
        name: item.name,
        state: item.state ? "Activo" : "Inactivo",
        actions: renderActions(item, item),
        // Acciones dinámicas por persona
      }));

      console.log("Datos formateados:", formattedData);
      setCenter(formattedData);
    } catch (error) {
      console.error("Error al obtener centros:", error);
    }finally {
      setTimeout(() => {
          setLoading(false);
      }, 1000);
  }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // Columnas de la tabla
  const columns = [
    { key: "name", title: "Nombre del centro" },
    { key: "state", title: "Estado" },
    { key: "actions", title: "Acciones" },
  ];

  return (
    <div className="xl:col-span-5">
      <Notification />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Contenido pestaña de listado */}
          {activeTab === "listado" && (
            <TableComponent
              columns={columns}
              data={center} // Usar los datos obtenidos de la API
              title="Centros de Formación"
              showButton={true}
              buttonText="Agregar Centro"
              OpenModalAdd={openAddModal}
            />
          )}

          {/* Modales */}
          {isOpenModal === "Editar" && (
            <EditTrainingCenter
              isOpen={isOpenModal === "Editar"}
              onClose={handleCloseModal}
              centerId={selectedCenterId}
              fetchCenters={fetchCenters}
            />
          )}
          <AddtrainingCenter
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            fetchCenters={fetchCenters}
          />
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title={`¿Está seguro que desea eliminar este centro?`}
            onConfirm={handleDeleteCenter}
            onClose={closeDeleteModal}
          />
        </>
      )}
    </div>
  );
}
