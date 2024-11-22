"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/loadingSpinner";
import cardService from "@/app/services/cardService";
import studentsService from "@/app/services/studentsService";
import { notifySuccess, notifyError } from '../../../components/notification';

export default function Page() {
  const [peopleData, setPeopleData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [editedData, setEditedData] = useState({
    document: "",
    blood_type: "",
    studySheet: "",
    trainingCenter: "",
    journey: "",
    program: "",
    date_birth: "", // Cambiado a snake_case
    address: "",
  });

  const fetchPeople = async () => {
    const userDocumentStr = String(localStorage.getItem("userDocument"));
    if (!userDocumentStr) return;

    try {
      const response = await cardService.getAll(userDocumentStr);
      setPeopleData(response.data);

      // Mapeamos dateBirth a date_birth
      setEditedData({
        document: response.data.document || "",
        blood_type: response.data.bloodType || "",
        studySheet: response.data.studySheet || "",
        trainingCenter: response.data.trainingCenter || "",
        journey: response.data.journey || "",
        program: response.data.program || "",
        date_birth: response.data.dateBirth || "", // Mapeo
        address: response.data.address || "",
      });
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("No se pudo obtener la información del usuario.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo editado: ${name}, Valor: ${value}`); // Para verificar
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const userDocument = String(localStorage.getItem("userDocument"));
      if (userDocument) {
        const dataToSend = {
          data: {
            document: parseInt(editedData.document),
            name: peopleData?.name || "",
            lastname: peopleData?.lastname || "",
            date_birth: editedData.date_birth || "2000-01-01", // Fecha predeterminada
            blood_type: editedData.blood_type || "",
            address: editedData.address || "cllae 2",
            email: peopleData?.email || "",
            photo: peopleData?.photo || "",
            phone: peopleData?.phone || "",
            stateP: peopleData?.stateP || true,
            document_type: peopleData?.document_type || 1,
            stateS: peopleData?.stateS || "active",
            studySheet: peopleData?.studySheet || "",
          },
        };
  
        console.log("Datos a enviar:", dataToSend); // Verifica el contenido
        await studentsService.putStudentCard(userDocument, dataToSend, true);
        alert("Datos actualizados correctamente");
  
        // Recarga la página después de guardar los cambios
        window.location.reload();
      } else {
        alert("Documento de usuario no encontrado.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  };
  

  useEffect(() => {
    fetchPeople();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="xl:col-span-5">
      <div className="flex justify-center items-center">
        <div className="container mx-auto mt-20 flex items-center justify-center">
          <div className="w-full max-w-4xl overflow-hidden bg-white shadow-lg rounded-lg">
            <div className="flex flex-col md:flex-row">
              <div className="bg-custom-blues dark:bg-darkBlue md:w-1/2 p-6 flex flex-col items-center justify-center">
                <div className="w-80 h-80 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={peopleData?.photo || ""}
                    alt="Foto del aprendiz"
                    className="w-full h-full object-cover"
                    width={1000}
                    height={760}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h2 className="uppercase text-2xl font-bold text-white">
                    {peopleData
                      ? `${peopleData.name} ${peopleData.lastname}`
                      : "Cargando..."}
                  </h2>
                  <p className="text-white/80">
                    Aprendiz {peopleData?.program || "Cargando..."}
                  </p>
                </div>
              </div>
              <div className="md:w-2/3 p-6 bg-green-50 relative">
                <h1 className="text-2xl mb-8 mt-2 font-bold text-custom-blues dark:text-darkBlue">
                  Carnet
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-4 text-lg">
                  {/* Primera columna */}
                  <div className="space-y-2">
                    <div>
                      <p>
                        <span className="font-semibold">{peopleData?.acronym}:</span>
                      </p>
                      {isSwitchOn ? (
                        <input
                          type="text"
                          name="document"
                          value={editedData.document}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                          readOnly  // Este campo será solo de lectura cuando el switch esté activado
                        />
                      ) : (
                        <p>{peopleData?.document || "Cargando..."}</p>
                      )}
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">Programa:</span>
                      </p>
                      {isSwitchOn ? (
                        <input
                          type="text"
                          name="program"
                          value={editedData.program}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                          readOnly  // Este campo será solo de lectura cuando el switch esté activado
                        />
                      ) : (
                        <p>{peopleData?.program || "Cargando..."}</p>
                      )}
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">Ficha:</span>
                      </p>
                      {isSwitchOn ? (
                        <input
                          type="text"
                          name="studySheet"
                          value={editedData.studySheet}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                          readOnly  // Este campo será solo de lectura cuando el switch esté activado
                        />
                      ) : (
                        <p>{peopleData?.studySheet || "Cargando..."}</p>
                      )}
                    </div>
                    {/* Campo dinámico de Fecha de Nacimiento */}
                    <div
                      className={`${
                        isSwitchOn ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                      } overflow-hidden transition-all duration-500`}
                    >
                      <p>
                        <span className="font-semibold">Fecha de Nacimiento:</span>
                      </p>
                      <input
                        type="date"
                        name="date_birth"
                        value={editedData.date_birth || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
  
                  {/* Segunda columna */}
                  <div className="space-y-2">
                    <div>
                      <p>
                        <span className="font-semibold">Centro:</span>
                      </p>
                      {isSwitchOn ? (
                        <input
                          type="text"
                          name="trainingCenter"
                          value={editedData.trainingCenter}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                          readOnly  // Este campo será solo de lectura cuando el switch esté activado
                        />
                      ) : (
                        <p>{peopleData?.trainingCenter || "Cargando..."}</p>
                      )}
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">Jornada:</span>
                      </p>
                      {isSwitchOn ? (
                        <input
                          type="text"
                          name="journey"
                          value={editedData.journey}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                          readOnly  // Este campo será solo de lectura cuando el switch esté activado
                        />
                      ) : (
                        <p>{peopleData?.journey || "Cargando..."}</p>
                      )}
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">Tipo de sangre:</span>
                      </p>
                      {isSwitchOn ? (
                        <input
                          type="text"
                          name="blood_type"
                          value={editedData.blood_type}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md uppercase"
                        />
                      ) : (
                        <p className="text-black">{peopleData?.bloodType || "Por actualizar."}</p>

                      )}
                    </div>
                    {/* Campo dinámico de Dirección */}
                    <div
                      className={`${
                        isSwitchOn ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                      } overflow-hidden transition-all duration-500`}
                    >
                      <p>
                        <span className="font-semibold">Dirección:</span>
                      </p>
                      <input
                        type="text"
                        name="address"
                        value={editedData.address || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                {/* Switch y botón guardar */}
                <div className="mt-6 flex items-center space-x-4 ">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isSwitchOn}
                      onChange={() => {
                        setIsSwitchOn(!isSwitchOn);
                        // Si se desactiva, limpiar la fecha de nacimiento
                        if (isSwitchOn)
                          setEditedData((prev) => ({ ...prev, birthDate: "" }));
                      }}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600">
                      <div className="absolute top-[2px] start-[2px] w-5 h-5 bg-white border-gray-300 border rounded-full transition-all peer-checked:translate-x-full peer-checked:bg-blue-600"></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900  dark:text-gray-400">
                      Editar
                    </span>
                  </label>
                  {isSwitchOn && (
                    <button
                      onClick={handleUpdate}
                      className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-custom-green dark:hover:bg-lime-800 dark:focus:ring-blue-800"
                    >
                      Actualizar!
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
