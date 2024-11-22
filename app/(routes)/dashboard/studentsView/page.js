"use client";
import TableComponent from '@/app/components/table';
import React, { useEffect, useState, useCallback, useMemo, lazy } from 'react';
import ConfirmationModal from "@/app/components/delete";
import TableMassive from "@/app/components/chargeMassive";
import { HiPencilAlt } from 'react-icons/hi';
import { FaRegTrashAlt } from 'react-icons/fa';
import LoadingSpinner from '../../../components/loadingSpinner';
import Notification, { notifySuccess, notifyError } from '../../../components/notification';
import studentsService from '@/app/services/studentsService';

const EditStudent = lazy(() => import("../../../components/Modals/Students/editStudent"));
const AddStudent = lazy(() => import("../../../components/Modals/Students/addStudent"));

export default function StudentsView() {
    const [activeTab, setActiveTab] = useState('listado'); 
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [students, setStudents] = useState([]); 
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const studentResponse = await studentsService.getAll();
            const studentsData = Array.isArray(studentResponse.data.data)
                ? studentResponse.data.data
                : [studentResponse.data.data];
                
            const combinedData = studentsData.map((student) => ({
                document: student.person?.document ||  "Por definir",
                name: student.person?.name ||  "Por definir",
                lastname: student.person?.lastname ||  "Por definir",
                date_birth: student.person?.date_birth || "Por definir",
                blood_type: student.person?.blood_type || "Por definir",
                address: student.person?.address || "Por definir",
                email: student.person?.email ||  "Por definir",
                phone: student.person?.phone ||  "Por definir",
                stateP: student.person?.stateP ? "Activo" : "Inactivo",
                stateS: student.stateS ||  "Por definir",
                document_type: student.person?.document_type?.acronym ||  "Por definir",
                studySheet: student.studySheet?.number ||  "Por definir",
                actions: renderActions(student),
            }));

            setStudents(combinedData);
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

    const handleDeleteModalToggle = useCallback((studentId = null) => {
        console.log("ID del estudiante a eliminar:", studentId);
        setStudentToDelete(studentId);
        setIsDeleteModalOpen((prev) => !prev);
    }, []);

    const handleDeleteStudent = useCallback(async () => {
        if (!studentToDelete) {
            notifyError("No se ha seleccionado ningún estudiante para eliminar");
            return;
        }
        try {
            await studentsService.deleteStudents(studentToDelete); // Usar solo el ID aquí
            setStudents((prev) => prev.filter((student) => student.id !== studentToDelete));
            notifySuccess('Estudiante eliminado exitosamente');
            handleDeleteModalToggle();
        } catch (error) {
            notifyError('Error al eliminar el estudiante:', error);
        }
    }, [studentToDelete, handleDeleteModalToggle]);

    const handleEditModalOpen = async (id) => {
        setSelectedPersonId(id); // Almacenar el ID seleccionado
        try {
            const response = await studentsService.getById(id); // Obtener datos del estudiante
            setStudentData(response.data.data); // Almacenar los datos del estudiante en el estado
        } catch (error) {
            console.error("Error al obtener los datos del estudiante para editar:", error);
            notifyError("Error al cargar los datos del estudiante.");
        }
    };
    

    const renderActions = useCallback(
        (student) => (
            <div className="flex space-x-2">
                <HiPencilAlt
                    className="w-5 h-5 cursor-pointer text-custom-blues"
                    onClick={() => handleEditModalOpen(student.id)}
                />
                <FaRegTrashAlt
                    className="w-5 h-5 cursor-pointer text-red-500"
                    onClick={() => handleDeleteModalToggle(student.id)}  // Pasa solo el ID aquí
                />
            </div>
        ),
        [students, handleDeleteModalToggle]
    );

    const columns = useMemo(() => [
        { key: 'name', title: 'Nombre' },
        { key: 'lastname', title: 'Apellido' },
        { key: 'document_type', title: 'Tipo de Documento' },
        { key: 'document', title: 'Número de Documento' },
        { key: 'email', title: 'Correo electrónico' },
        { key: 'phone', title: 'Teléfono' },
        { key: 'date_birth', title: 'Fecha de nacimiento' },
        { key: 'blood_type', title: 'RH' },
        { key: 'stateP', title: 'Estado' },
        { key: 'stateS', title: 'Etapa' },
        { key: 'studySheet', title: 'Ficha' },
        { key: 'actions', title: 'Acciones'}
    ], );

    return (
        <> <Notification/>
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
                                    Listado de Estudiantes
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
                                data={students}
                                title="Estudiantes"
                                showButton={true}
                                buttonText="Agregar Estudiante"
                                OpenModalAdd={handleAddModalToggle}
                            />
                        )}
                        {activeTab === 'carga' && (
                            <TableMassive
                                columns={columns}
                                title="Carga masiva"
                                showButton={true}
                                OpenModalAdd={handleAddModalToggle}
                            />
                        )}

                         {selectedPersonId && studentData && (
                          <EditStudent
                          isOpen={!!selectedPersonId} 
                          onClose={() => {
                          setSelectedPersonId(null);
                          setStudentData(null); // Limpiar los datos después de cerrar el modal
                        }} 
                        studentData={studentData} 
                        fetchData={fetchData}
                              />
                        )}
                        <AddStudent isOpen={isAddModalOpen} onClose={handleAddModalToggle} fetchData={fetchData} />

                        <ConfirmationModal
                            isOpen={isDeleteModalOpen}
                            title={`¿Está seguro que desea eliminar este estudiante?`}
                            onConfirm={handleDeleteStudent}
                            onCancel={() => handleDeleteModalToggle()}
                        />
                    </div>
            )}
        </>
    );
};