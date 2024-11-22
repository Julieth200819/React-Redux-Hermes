"use client";
import TableComponent from '@/app/components/table';
import React, { useEffect, useState, useCallback, useMemo, lazy } from 'react';
import ConfirmationModal from "@/app/components/delete";
import LoadingSpinner from '../../../components/loadingSpinner';
import Notification, { notifySuccess, notifyError } from '../../../components/notification';
import teachersService from '../../../services/instructorService';
const EditTeacher = lazy(() => import("../../../components/Modals/Instructor/editInstructor"));
const AddTeacher = lazy(() => import("../../../components/Modals/Instructor/addInstructor"));

import { HiPencilAlt } from 'react-icons/hi';
import { FaRegTrashAlt } from 'react-icons/fa';
import TeacherTableMassive from '@/app/components/chargeMassiveTeacher';

export default function TeachersView() {
    const [activeTab, setActiveTab] = useState('listado');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teacherData, setTeacherData] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const teacherResponse = await teachersService.getAll();
            const teachersData = Array.isArray(teacherResponse.data.data)
                ? teacherResponse.data.data
                : [teacherResponse.data.data];

            const combinedData = teachersData.map((teacher) => ({
                document: teacher.person?.document || "No disponible",
                name: teacher.person?.name || "No disponible",
                lastname: teacher.person?.lastname || "No disponible",
                date_birth: teacher.person?.date_birth || "No disponible",
                blood_type: teacher.person?.blood_type || "No disponible",
                address: teacher.person?.address || "No disponible",
                email: teacher.person?.email || "No disponible",
                phone: teacher.person?.phone || "No disponible",
                stateT: teacher.person?.stateT === "activo" ? "activo" : "inactivo",
                document_type: teacher.person?.document_type?.acronym || "No disponible",
                actions: renderActions(teacher),
            }));

            setTeachers(combinedData);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddModalToggle = () => setIsAddModalOpen((prev) => !prev);

    const handleDeleteModalToggle = useCallback((teacherId = null) => {
        setTeacherToDelete(teacherId);
        setIsDeleteModalOpen((prev) => !prev);
    }, []);

    const handleDeleteTeacher = useCallback(async () => {
        if (!teacherToDelete) {
            notifyError("No se ha seleccionado ningún profesor para eliminar");
            return;
        }
        try {
            await teachersService.deleteTeacher(teacherToDelete);
            setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherToDelete));
            notifySuccess('Profesor eliminado exitosamente');
            handleDeleteModalToggle();
        } catch (error) {
            notifyError('Error al eliminar el profesor:', error);
        }
    }, [teacherToDelete, handleDeleteModalToggle]);

    const handleEditModalOpen = async (id) => {
        setSelectedPersonId(id);
        try {
            const response = await teachersService.getById(id);
            setTeacherData(response.data.data); // Almacena los datos del instructor
        } catch (error) {
            console.error("Error al obtener los datos del profesor para editar:", error);
            notifyError("Error al cargar los datos del profesor.");
        }
    };

    const renderActions = useCallback(
        (teacher) => (
            <div className="flex space-x-2">
                <HiPencilAlt
                    className="w-5 h-5 cursor-pointer text-custom-blues"
                    onClick={() => handleEditModalOpen(teacher.id)}
                />
                <FaRegTrashAlt
                    className="w-5 h-5 cursor-pointer text-red-500"
                    onClick={() => handleDeleteModalToggle(teacher.id)}
                />
            </div>
        ),
        [teachers, handleDeleteModalToggle]
    );

    const columns = useMemo(() => [
        { key: 'name', title: 'Nombre' },
        { key: 'lastname', title: 'Apellido' },
        { key: 'document_type', title: 'Tipo de Documento' },
        { key: 'document', title: 'Número de Documento' },
        { key: 'email', title: 'Correo electrónico' },
        { key: 'address', title: 'Dirección' },
        { key: 'phone', title: 'Teléfono' },
        { key: 'date_birth', title: 'Fecha de nacimiento' },
        { key: 'blood_type', title: 'RH' },
        { key: 'stateT', title: 'Estado' },
        { key: 'actions', title: 'Acciones' }
    ], []);

    return (
        <> <Notification />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="xl:col-span-5">
                    <div className="flex flex-col items-center pt-4 max-w-full mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="flex space-x-4 mt-2 bg-custom-blue rounded-3xl p-3 shadow-md">
                            <button
                                onClick={() => setActiveTab('listado')}
                                className={`px-2 py-1 rounded-lg ease-in-out duration-300 ${activeTab === 'listado' ? 'bg-custom-blues text-white shadow-md shadow-custom-green' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                            >
                                Listado de Instructores
                            </button>
                            <button
                                onClick={() => setActiveTab('carga')}
                                className={`px-2 py-1 rounded-lg ease-in-out duration-300 ${activeTab === 'carga' ? 'bg-custom-blues text-white shadow-md shadow-custom-green' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                            >
                                Carga masiva
                            </button>
                        </div>
                    </div>

                    {activeTab === 'listado' && (
                        <TableComponent
                            columns={columns}
                            data={teachers}
                            title="Intructores"
                            showButton={true}
                            buttonText="Agregar Instructor"
                            OpenModalAdd={handleAddModalToggle}
                        />
                    )}

                    {activeTab === 'carga' && (
                            <TeacherTableMassive
                                columns={columns}
                                title="Carga masiva"
                                showButton={true}
                                OpenModalAdd={handleAddModalToggle}
                            />
                        )}

                    {selectedPersonId && teacherData && (
                        <EditTeacher
                            isOpen={!!selectedPersonId}
                            onClose={() => {
                                setSelectedPersonId(null);
                                setTeacherData(null);
                            }}
                            teacherData={teacherData} 
                            fetchData={fetchData}
                        />
                    )}

                    <AddTeacher isOpen={isAddModalOpen} onClose={handleAddModalToggle} fetchData={fetchData} />

                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        title={`¿Está seguro que desea eliminar este instructor?`}
                        onConfirm={handleDeleteTeacher}
                        onClose={() => handleDeleteModalToggle()}
                    />
                </div>
            )}
        </>
    );
}
