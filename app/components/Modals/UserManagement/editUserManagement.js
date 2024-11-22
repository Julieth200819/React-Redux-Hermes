"use client";
import React, { useEffect, useState } from 'react';
import UserService from '@/app/services/userService';
import RoleService from '@/app/services/roleService';
import { notifyError, notifySuccess } from '../../notification';

const EditUserManagement = ({ isOpen, onClose, userToEdit }) => {
const [formData, setFormData] = useState({
roles: [],
});
  const [user, setUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const response = await RoleService.getAll();
        setAllRoles(response.data.data || []);
      } catch (error) {
        console.error("Error al obtener todos los roles:", error);
        notifyError('Error al obtener todos los roles.');
      }
    };
    fetchAllRoles();
  }, []);

  if (!isOpen) return null;

  useEffect(() => {
    if (userToEdit) {
      console.log('Datos para editar:', userToEdit);
      setFormData({
        roles: userToEdit.roleList || [],
      });
    }
  }, [userToEdit]);


  const handleChanges = (e) => {
    const{name,value}=e.target;
    setFormData({
      ...formData,
      [name]:value,
    });
    setErrors((prevErrors)=>({
      ...prevErrors,
      [name]:'',
    }));
    console.log('Datos para guardar:', formData);
  };
  
  if (!isOpen) return null;
  
  const handleSaveChanges = () => {
    const updatedUser = {
      data:{
        roles:formData.roles,
      },
    };
  };

  return (
    <div className="modal">
      {/* Contenido del modal */}
      <button onClick={handleSaveChanges}>Guardar cambios</button>
    </div>
  );
};

export default EditUserManagement;
