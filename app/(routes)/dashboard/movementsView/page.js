"use client";
import TableComponent from '@/app/components/table';
import React, { useEffect, useState } from 'react';
import { HiEye } from "react-icons/hi";
import AddEntry from "@/app/components/Modals/Movements/addMovements";
import AddExit from '@/app/components/Modals/Movements/addExit';
import EquipmentDetails from "@/app/components/Modals/Movements/detailsMovements";
import PeopleService from "@/app/services/peopleService";
import headquarterService from '@/app/services/headquarterService';
import Notification from '../../../components/notification';
import entranceService from '@/app/services/entranceService';
import equipmentService from '@/app/services/equipmentService';
import exitService from '@/app/services/exitService';

export default function MovementsView() {
    const [activeTab, setActiveTab] = useState('entradas');
    const [isAddModalEntranceOpen, setIsAddModalEntranceOpen] = useState(false);
    const [isAddModalExitOpen, setIsAddModalExitOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [entries, setEntries] = useState([]);
    const [exits, setExits] = useState([]);  

    const fetchEntries = async () => {
        try {
            const entranceResponse = await entranceService.getAll();
            const { data: { data: entranceData = [] } } = entranceResponse;            

            const entranceFormattedData = entranceData.map(entrance => ({
                id: entrance.id,
                dateTime: entrance.dateTime,
                justification: entrance.justification,
                person: entrance.person.name,
                document: entrance.person.document,
                headquarter: entrance.headquarter.name,
                equipmentList: entrance.equipmentList || [],
                equipmentCount: entrance.equipmentList?.length || 0,
                actions: renderActions(entrance),
            }));

            setEntries(entranceFormattedData);            
        } catch (error) {
            console.error("Error al obtener entradas:", error);
        }
    };

    const fetchExits = async () => {
        try {
            const exitResponse = await exitService.getAll();
            const { data: { data: exitData = [] } } = exitResponse;

            console.log("Datos de salida recibidos:", exitData);

            const exitFormattedData = exitData.map(exit => ({
                id: exit.id,
                dateTime: exit.date_time,
                person: exit.entrance?.person?.name || 'No disponible',
                document: exit.entrance?.person?.document || 'No disponible',
                headquarter: exit.entrance?.headquarter?.name || 'No disponible',
                equipmentList: exit.equipmentList || [],
                equipmentCount: exit.equipmentList?.length || 0,
                actions: renderActions(exit),
            }));

            setExits(exitFormattedData);
        } catch (error) {
            console.error("Error al obtener salidas:", error);
        }
    };

    useEffect(() => {
        fetchEntries();
        fetchExits();
    }, []);

    const openEquipmentDetails = (equipmentList) => {
        console.log("Equipo seleccionado:", equipmentList);
        setSelectedEquipment(equipmentList);
    };

    const closeEquipmentDetails = () => {
        setSelectedEquipment(null);
    };

    const renderActions = (record) => (
        <div className="flex space-x-2">             
            <HiEye
                className="w-5 h-5 cursor-pointer text-blue-500"
                onClick={() => {
                    if (record.equipmentList?.length > 0) {
                        openEquipmentDetails(record.equipmentList);
                    } else {
                        const message = record.hasOwnProperty('justification') 
                            ? "No se registraron equipos en esta entrada"
                            : "No se registraron equipos en esta salida";
                        notifyError(message);
                    }
                }}
            />
        </div>
    );

    const openAddModalEntrance = () => setIsAddModalEntranceOpen(true);
    const closeAddModalEntrance = () => setIsAddModalEntranceOpen(false);

    const openAddModalExit = () => setIsAddModalExitOpen(true);
    const closeAddModalExit = () => setIsAddModalExitOpen(false);

    const entryColumns = [
        { 
            key: 'dateTime', 
            title: 'Fecha y Hora',
            render: (value) => new Date(value).toLocaleString()
        },
        { key: 'justification', title: 'Justificación' },
        { key: 'person', title: 'Persona' },
        { key: 'headquarter', title: 'Sede' },
        { key: 'equipmentCount', title: 'Cantidad de Equipos' },
        { key: 'actions', title: 'Detalles de equipo' }
    ];

    const exitColumns = [
        { 
            key: 'dateTime', 
            title: 'Fecha y Hora',
            render: (value) => new Date(value).toLocaleString()
        },
        { key: 'person', title: 'Persona' },
        { key: 'headquarter', title: 'Sede' },
        { key: 'equipmentCount', title: 'Cantidad de Equipos' },
        { key: 'actions', title: 'Detalles de equipo' }
    ];

    return (
            <div className="xl:col-span-5">
                <Notification/>
                <div className="flex flex-col items-center pt-4 max-w-full mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="flex space-x-4 mt-2 bg-custom-blue rounded-3xl p-3 shadow-md">
                        <button
                            onClick={() => setActiveTab('entradas')}
                            className={`px-2 py-1 rounded-lg ${activeTab === 'entradas' ? 'bg-custom-blues text-white' : 'bg-white text-gray-800'}`}
                        >
                            Entradas
                        </button>
                        <button
                            onClick={() => setActiveTab('salidas')}
                            className={`px-2 py-1 rounded-lg ${activeTab === 'salidas' ? 'bg-custom-blues text-white' : 'bg-white text-gray-800'}`}
                        >
                            Salidas
                        </button>
                    </div>
                </div>

                {activeTab === 'entradas' && (
                    <TableComponent
                        columns={entryColumns}
                        data={entries}
                        title="Entradas"
                        showButton={true}
                        buttonText="Agregar Entrada"
                        OpenModalAdd={openAddModalEntrance}
                        showExportButton={true}
                    />
                )}

                {activeTab === 'salidas' && (
                    <TableComponent
                        columns={exitColumns}
                        data={exits}
                        title="Salidas"
                        showButton={true}
                        buttonText="Agregar Salida"
                        OpenModalAdd={openAddModalExit}
                        showExportButton={true}
                    />
                )}

                {selectedEquipment && (
                    <EquipmentDetails
                        equipment={selectedEquipment}
                        isOpen={!!selectedEquipment}
                        onClose={closeEquipmentDetails}
                    />
                )}

                {isAddModalEntranceOpen && (
                    <AddEntry
                        isOpen={isAddModalEntranceOpen}
                        onClose={closeAddModalEntrance}
                    />
                )}

                {isAddModalExitOpen && (
                    <AddExit
                        isOpen={isAddModalExitOpen}
                        onClose={closeAddModalExit}
                    />
                )}
            </div>
    );
};
