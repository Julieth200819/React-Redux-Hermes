"use client";
import React, { useEffect, useState, useMemo } from 'react';
import TableComponent from '@/app/components/table';
import environmentsService from '@/app/services/environmentsService'; // O el servicio correcto para las entradas

export default function EntriesView (){
    const [entries, setEntries] = useState([]);

    // Función para cargar entradas
    const fetchEntries = async () => {
        try {
            // Obtener todas las entradas del servicio correcto
            const response = await environmentsService.getAll(); // Ajusta esto a tu servicio para obtener entradas
            const data = response.data.data; // Ajusta según la estructura de tu respuesta
            // Filtrar solo las entradas con datos completos
            const filteredData = data
                .filter(entry => 
                    entry.personName && 
                    entry.personLastName && 
                    entry.personDocument &&
                    entry.dateTime && 
                    entry.justification && 
                    entry.updatedAt &&
                    entry.fkHeadquarter
                )
                .map(entry => ({
                    id: entry.id,
                    person_name: entry.personName, 
                    person_lastname: entry.personLastName, 
                    person_document: entry.personDocument, 
                    date_time: entry.dateTime, 
                    justification: entry.justification,
                    update_at: entry.updatedAt,
                    fk_id_headquarter: entry.headquarter, 
                }));

            setEntries(filteredData);
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    // Fetch de entradas al cargar el componente
    useEffect(() => {
        fetchEntries();
    }, []);

    // Memoizar columnas
    const columns = useMemo(() => [
        { key: 'person_name', title: 'Nombre' },
        { key: 'person_lastname', title: 'Apellido' },
        { key: 'person_document', title: 'Documento' },
        { key: 'date_time', title: 'Fecha y hora' },
        { key: 'justification', title: 'Justificación' },
        { key: 'update_at', title: 'Actualizado en' },
        { key: 'headquarter', title: 'ID Sede' },
    ], []);

    // Memoizar los datos de las entradas
    const memoizedEntries = useMemo(() => entries, [entries]);

    return (
       
            <div className="xl:col-span-5">
                <TableComponent
                    columns={columns}
                    data={memoizedEntries} // Usar las entradas memoizadas
                    title="Entradas"
                    showButton={false} // No se muestra el botón de agregar
                />
            </div>
     
    );
};