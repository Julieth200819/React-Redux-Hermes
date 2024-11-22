"use client";
import React, { useState } from "react";
import Table from "@/app/components/table";

export default function PeopleTable() {
  const [activeTab, setActiveTab] = useState("externos"); // Estado para las pestañas

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
      <div className="xl:col-span-5">
        <div className="flex flex-col items-center pt-4 max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          {/* Pestañas */}
          <div className="flex space-x-4 mt-2 bg-custom-blue rounded-3xl p-3 shadow-md">
            <button
              onClick={() => handleTabChange("externos")}
              className={`px-2 py-1 rounded-lg ease-in-out duration-300 ${
                activeTab === "externos"
                  ? "bg-custom-blues text-white shadow-md shadow-custom-green"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Personas Externas
            </button>
            <button
              onClick={() => handleTabChange("ficha")}
              className={`px-2 py-1 rounded-lg ease-in-out duration-300 ${
                activeTab === "ficha"
                  ? "bg-custom-blues text-white shadow-md shadow-custom-green"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Ficha 234566
            </button>
          </div>

          {/* Tablas */}
          <div className="mt-0 w-full lg:w-4/5">
            {activeTab === "externos" ? (
              <Table
                title="Detalles de invitados"
                showButton={true}
                buttonText="Agregar invitado"
                columns={[
                  { key: "name", title: "Nombre" },
                  { key: "last_name", title: "Apellido" },
                  { key: "document_type", title: "Tipo de documento" },
                  { key: "document", title: "Número de documento" },
                  { key: "institution", title: "Institución" },
                  { key: "phone", title: "Teléfono" },
                  { key: "email", title: "Correo electrónico" },
                ]}
                data={[
                  {
                    name: "Juan",
                    last_name: "Pérez",
                    document_type: "Cédula",
                    document: "12345678",
                    institution: "Ejemplo S.A.",
                    phone: "123456789",
                    email: "juanperez@ejemplo.com",
                  },
                  {
                    name: "María",
                    last_name: "González",
                    document_type: "Pasaporte",
                    document: "A1234567",
                    institution: "Ejemplo Ltda.",
                    phone: "987654321",
                    email: "mariagonzalez@ejemplo.com",
                  },
                  {
                    name: "Carlos",
                    last_name: "Ramírez",
                    document_type: "Cédula",
                    document: "87654321",
                    institution: "Compañía ABC",
                    phone: "555555555",
                    email: "carlosramirez@ejemplo.com",
                  },
                  {
                    name: "Ana",
                    last_name: "López",
                    document_type: "Cédula",
                    document: "23456789",
                    institution: "Instituto XYZ",
                    phone: "444444444",
                    email: "analopez@ejemplo.com",
                  },
                  {
                    name: "Luis",
                    last_name: "Martínez",
                    document_type: "RUC",
                    document: "1234567890",
                    institution: "Negocios LM",
                    phone: "333333333",
                    email: "luismartinez@ejemplo.com",
                  },
                ]}
              />
            ) : (
              <Table
                title="Detalles de invitados"
                showButton={true}
                buttonText="Agregar invitado"
                columns={[
                  { key: "name", title: "Nombre" },
                  { key: "last_name", title: "Apellido" },
                  { key: "document_type", title: "Tipo de documento" },
                  { key: "document", title: "Número de documento" },
                ]}
                data={[
                  {
                    name: "Sofía",
                    last_name: "Córdoba",
                    document_type: "Cédula",
                    document: "34567890",
                  },
                  {
                    name: "Diego",
                    last_name: "Castillo",
                    document_type: "Pasaporte",
                    document: "B9876543",
                  },
                  {
                    name: "Valentina",
                    last_name: "Hernández",
                    document_type: "Cédula",
                    document: "45678901",
                  },
                  {
                    name: "Andrés",
                    last_name: "Vargas",
                    document_type: "RUC",
                    document: "1234567891",
                  },
                  {
                    name: "Camila",
                    last_name: "Rojas",
                    document_type: "Cédula",
                    document: "56789012",
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
  );
};