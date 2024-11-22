"use client";
import TableComponent from '@/app/components/table';
import React, { useEffect, useState } from 'react';
import UserService from '@/app/services/userService';
import Notification from '@/app/components/notification';
import EditUserManagement from '@/app/components/Modals/UserManagement/editUserManagement';
import { HiPencilAlt } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmationModal from '@/app/components/delete';
import LoadingSpinner from '../../../components/loadingSpinner';

export default function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchDocument, setSearchDocument] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userResponse = await UserService.getAll();
      const { data: { data: userData = [] } } = userResponse;

      console.log("Datos de usuario recibidos:", userData);

      const userFormattedData = userData.map(user => ({
        id: user.id,
        name: user.person?.name || 'No disponible',
        lastname: user.person?.lastname || 'No disponible',
        document: user.person?.document || 'No disponible',
        state: user.state ? 'Activo' : 'Inactivo',
        roles: user.roleList?.map(role => role.name).join(', ') || 'No disponible',
        actions: renderActions(user),
      }));

      setUsers(userFormattedData);
      setFilteredUsers(userFormattedData);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleSearchChange = (e) => {
    setSearchDocument(e.target.value);
  };

  const handleSearch = () => {
    const filtered = users.filter(user =>
      user.document.toString().includes(searchDocument)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (modalType) => setIsOpenModal(modalType);
  const handleCloseModal = () => {
    setIsOpenModal(null);
    setUserToEdit(null);
  };

  

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    try {
      await UserService.deleteUser(userToDelete.id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      notifySuccess("Usuario eliminado con éxito");
      closeDeleteModal();
    } catch (error) {
      notifyError('Error al eliminar el usuario');
    }
  };

  const renderActions = (user) => (
    <div className="flex space-x-2">
      <HiPencilAlt
        className="w-5 h-5 cursor-pointer text-custom-blues"
        onClick={() => {
          setUserToEdit(user);
          handleOpenModal('Editar');
        }} />
      <FaRegTrashAlt
        className="w-5 h-5 cursor-pointer text-red-500"
        onClick={() => openDeleteModal(user)} />
    </div>
  );

  const columns = [
    { key: 'document', title: 'Documento' },
    { key: 'name', title: 'Nombre' },
    { key: 'lastname', title: 'Apellido' },
    { key: 'state', title: 'Estado' },
    { key: 'roles', title: 'Roles' },
    { key: 'actions', title: 'Acciones' },
  ];

  return (
    <>
      <Notification />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="xl:col-span-5">
          <TableComponent
            columns={columns}
            data={filteredUsers}
            title="Usuarios"
            showButton={false}
            buttonText="Agregar Usuario"
            showExportButton={false}
          />
          {isOpenModal === 'Editar' && (
            <EditUserManagement
              isOpen={isOpenModal === 'Editar'}
              onClose={handleCloseModal}
              userToEdit={userToEdit}
              fetchUsers={fetchUsers}
            />
          )}

          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title="¿Está seguro que desea eliminar este usuario?"
            onConfirm={handleDeleteUser}
            onClose={closeDeleteModal}
          />
        </div>
      )}
    </>
  );
}