"use client";
import TableComponent from "@/app/components/table";
import React, { useEffect, useState, useMemo } from "react";
import { HiPencilAlt } from "react-icons/hi";
import EditHeadquarter from "../../../components/Modals/Headquarter/editHeadquarter"; // Modal para editar una sede
import AddHeadquarter from "../../../components/Modals/Headquarter/addHeadquarter"; // Modal para añadir una nueva sede
import { FaRegTrashAlt } from "react-icons/fa";
import HeadquarterService from "@/app/services/headquarterService";
import trainingCentersService from "@/app/services/trainingCentersService";
import LoadingSpinner from '../../../components/loadingSpinner'
import ConfirmationModal from "@/app/components/delete";
import Notification, { notifySuccess, notifyError } from '../../../components/notification';

export default function HeadquartersView() {
  const [activeTab] = useState("listado");
  const [isOpenModal, setIsOpenModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [headquarters, setHeadquarters] = useState([]);
  const [headquarterToDelete, setHeadquarterToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHeadquarterId, setSelectedHeadquarterId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = (modalType, id = null) => {
    if (modalType === "Edit" && id) {
      const headquarterToEdit = headquarters.find((hq) => hq.id === id);
      if (headquarterToEdit) {
        setSelectedHeadquarterId(headquarterToEdit); // Almacena el objeto completo de la sede
        setIsOpenModal("Edit"); // Establece el modal que debe abrirse
      } else {
        console.warn("No se encontró la sede con el ID especificado");
      }
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(null);
    setSelectedHeadquarterId(null); // Limpia la sede seleccionada al cerrar el modal
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openDeleteModal = (headquarter) => {
    setHeadquarterToDelete(headquarter); // Almacenar la sede a eliminar
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setHeadquarterToDelete(null); // Limpiar el estado
  };

  const handleDeleteHeadquarter = async () => {
    try {
      await HeadquarterService.deleteHeadquarter(headquarterToDelete.id); // Llama al servicio de eliminación
      setHeadquarters((prevHeadquarters) =>
        prevHeadquarters.filter(
          (headquarter) => headquarter.id !== headquarterToDelete.id
        )
      ); // Actualiza el estado
      notifySuccess("Sede eliminada exitosamente");
      closeDeleteModal();
    } catch (error) {
      notifyError("Error al eliminar la sede");
    }
  };

  // Función para renderizar las acciones en la tabla
  const renderActions = (headquarter) => (
    <div className="flex space-x-2">
      <HiPencilAlt
        className="w-5 h-5 cursor-pointer text-custom-blues"
        onClick={() => handleOpenModal("Edit", headquarter.id)}
      />
      <FaRegTrashAlt
        className="w-5 h-5 cursor-pointer text-red-500"
        onClick={() => openDeleteModal(headquarter)}
      />
    </div>
  );

  const fetchHeadquarters = async () => {
    setLoading(true);
    try {
      const response = await HeadquarterService.getAll();
      console.log("Datos obtenidos de la API de sedes:", response.data);

      const headquarterData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      const centerResponse = await trainingCentersService.getAll();
      const centerData = centerResponse.data.data;
      console.log("Datos de centros de formación:", centerData);

      const formattedData = headquarterData.map((item) => {
        const TrainingCenterName = item.fkTrainingCenterDTO
          ? item.fkTrainingCenterDTO.name
          : "Sin centro de formación";
        return {
          id: item.id,
          name: item.name,
          address: item.address,
          state: item.state ? "Activo" : "Inactivo",
          training_center: TrainingCenterName,
        };
      });

      setHeadquarters(formattedData);
    } catch (error) {
      console.error("Error al obtener sedes:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchHeadquarters();
  }, []);

  const columns = useMemo(
    () => [
      { key: "name", title: "Nombre" },
      { key: "address", title: "Direccion" },
      { key: "state", title: "Estado" },
      { key: "training_center", title: "Centro de formación" },
      { key: "action", title: "Acciones" },
    ],
    []
  );

  return (
    <> <Notification/>
    {loading ? (
          <LoadingSpinner />
        ) : (
        <div className="xl:col-span-5">
          {/* Contenido pestaña de listado */}
          {activeTab === "listado" && (
            <TableComponent
              columns={columns}
              data={headquarters} // Usar los datos obtenidos de la API
              title="Sedes"
              showButton={true}
              buttonText="Agregar Sede"
              OpenModalAdd={openAddModal}
              renderActions={renderActions} // Añadir renderActions a TableComponent
            />
          )}

          {/* Modales */}
          {isOpenModal === "Edit" && (
            <EditHeadquarter
              isOpen={isOpenModal === "Edit"}
              onClose={handleCloseModal}
              headquarterId={selectedHeadquarterId}
              headquarterToEdit={selectedHeadquarterId}
              fetchHeadquarters={fetchHeadquarters}
            />
          )}
          <AddHeadquarter
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            fetchHeadquarters={fetchHeadquarters}
          />

          {/* Modal de Confirmación de Eliminación */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title={`¿Está seguro que desea eliminar esta sede?`}
            onConfirm={handleDeleteHeadquarter}
            onClose={closeDeleteModal}
          />
        </div>
      )}
    </>
  );
}
