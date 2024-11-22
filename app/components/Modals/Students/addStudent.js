
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import StudySheetService from "@/app/services/sheetService";
import documentTypeService from "../../../services/documentTypeService";
import { notifySuccess, notifyError } from '../../../components/notification';
import studentsService from "@/app/services/studentsService";

const AddStudent = ({ isOpen, onClose, fetchData }) => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [document_type, setDocument_type] = useState("");
  const [document, setDocument_number] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date_birth, setBirthdate] = useState("");
  const [blood_type, setBlood_Type] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [study_sheets, setStudy_sheets] = useState([]);
  const [study_sheet, setStudy_sheet] = useState("");
  const [photo, setPhoto] = useState ("");
  const [stateP, setStateP] = useState(true);
  const [stateS, setStateS] = useState("");
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await documentTypeService.getAll();
        const types = response.data.data;
        setDocumentTypes(types);
      } catch (error) {
        console.error("Error al obtener tipos de documentos:", error.message);
        setFetchError("No se pudieron cargar los tipos de documentos.");
        setDocumentTypes([]);
      }
    };

    const fetchStudySheets = async () => {
      try {
        const response = await StudySheetService.getAll();
        const types = response.data.data;
        setStudy_sheets(types);
      } catch (error) {
        console.error("Error al obtener fichas:", error.message);
        setFetchError("No se pudieron cargar fichas.");
        setStudy_sheets([]);
      }
    };
    fetchStudySheets();
    fetchDocumentTypes();
  }, []);

  if (!isOpen) return null;


  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!lastname) newErrors.lastname = "El apellido es obligatorio.";
    if (!document_type)
      newErrors.document_type = "El tipo de documento es obligatorio.";
    if (!document)
      newErrors.document = "El número de documento es obligatorio.";
    if (!email) newErrors.email = "El correo es obligatorio.";
    if (!phone) newErrors.phone = "El teléfono es obligatorio.";
    if (!date_birth)
      newErrors.date_birth = "La fecha de nacimiento es obligatoria.";
    if (!blood_type) newErrors.blood_type = "El tipo de sangre es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const newStudent = {
        data: {
          document,
          name,
          lastname,
          date_birth,
          blood_type,
          address,
          email,
          phone,
          stateP,
          document_type,
          stateS,
          study_sheet,
          photo,
        },
      };
      console.log("Datos recibidos:", JSON.stringify(newStudent, null, 2));
      try {
        await studentsService.postStudent(newStudent);
        notifySuccess("Estudiante agregado con éxito.");
        onClose(); // Cierra el formulario después de guardar
        fetchData();
      } catch (error) {
        notifyError("Error al agregar el estudiante:", error);

        // Verifica si error.response existe antes de acceder a sus propiedades
        const errorMessage = error.response
          ? error.response.data.message || "Ocurrió un error inesperado."
          : "No se pudo conectar al servidor.";

        console.error("No se pudo agregar el estudiante. " + errorMessage);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-full max-w-screen-sm p-4 rounded-lg shadow-lg transition-transform transform-gpu scale-95 hover:scale-100 dark:bg-gray-800 bg-opacity-91 bg-white max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-custom-blues dark:border-green-500">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-full p-2"
          >
            <IoIosArrowBack />
          </button>
          <div className="text-center flex-grow">
            <h2 className="text-2xl font-medium dark:text-white">
              Agregar estudiante
            </h2>
            <p className="text-gray-500">
              Completa la información para agregar un nuevo estudiante.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Contenido de la izquierda */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 dark:text-white font-medium"
              >
                Nombre:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nombres"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full p-2 border ${errors.name ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.name ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 dark:text-white font-medium"
              >
                Correo electrónico:<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full p-2 border ${errors.email ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.email ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label
                htmlFor="document_type"
                className="block mb-2 dark:text-white font-medium"
              >
                Tipo de documento:<span className="text-red-500">*</span>
              </label>
              <select
                id="document_type"
                value={document_type}
                onChange={(e) => setDocument_type(e.target.value)}
                className={`block w-full p-2.5 border ${errors.document_type
                    ? "border-red-500"
                    : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.document_type ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="">Selecciona un tipo de documento</option>
                {Array.isArray(documentTypes) &&
                  documentTypes.map((docType) => (
                    <option key={docType.id} value={docType.id}>
                      {docType.name}
                    </option>
                  ))}
              </select>
              {errors.document_type && (
                <p className="text-red-500">{errors.document_type}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="birthdate"
                className="block mb-2 dark:text-white font-medium"
              >
                Fecha de nacimiento:<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date_birth"
                value={date_birth}
                onChange={(e) => setBirthdate(e.target.value)}
                className={`block w-full p-2 border ${errors.date_birth ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.date_birth ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.date_birth && (
                <p className="text-red-500">{errors.date_birth}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 dark:text-white font-medium">
                Tipo de Sangre:<span className="text-red-500">*</span>
              </label>
              <select
                className={`block w-full p-2.5 border ${errors.blood_type ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.blood_type ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                value={blood_type}
                onChange={(e) => setBlood_Type(e.target.value)}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.blood_type && (
                <p className="text-red-500">{errors.blood_type}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="state"
                className="block mb-2 dark:text-white font-medium"
              >
                Estado:<span className="text-red-500">*</span>
              </label>
              <select
                id="stateP"
                value={stateP}
                onChange={(e) => setStateP(e.target.value === "true")}
                className={`block w-full p-2.5 border ${errors.stateP ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.stateP ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              {errors.stateP && <p className="text-red-500">{errors.stateP}</p>}
            </div>
          </div>
          {/* Contenido de la derecha */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="lastname"
                className="block mb-2 dark:text-white font-medium"
              >
                Apellido:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastname"
                placeholder="Apellidos"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className={`block w-full p-2 border ${errors.lastname ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.lastname ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.lastname && (
                <p className="text-red-500">{errors.lastname}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 dark:text-white font-medium"
              >
                Teléfono:<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`block w-full p-2 border ${errors.phone ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.phone ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label
                htmlFor="document_number"
                className="block mb-2 dark:text-white font-medium"
              >
                Número de documento:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="document"
                placeholder="Número de documento"
                value={document}
                onChange={(e) => setDocument_number(e.target.value)}
                className={`block w-full p-2 border ${errors.document ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.document ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.document && (
                <p className="text-red-500">{errors.document}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-2 dark:text-white font-medium"
              >
                Direccion:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                placeholder="Direccion"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`block w-full p-2 border ${errors.address ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.address ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="study_sheet"
                className="block mb-2 dark:text-white font-medium"
              >
                Ficha:<span className="text-red-500">*</span>
              </label>
              <select
                id="study_sheet"
                value={study_sheet}
                onChange={(e) => setStudy_sheet(e.target.value)} // Asegúrate de que esta función tome un valor único
                className={`block w-full p-2.5 border ${errors.study_sheets ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.study_sheets ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="">Selecciona una ficha:</option>
                {Array.isArray(study_sheets) &&
                  study_sheets.map((study_sheet) => (
                    <option key={study_sheet.number} value={study_sheet.number}>
                      {study_sheet.number}
                    </option>
                  ))}
              </select>

              {errors.study_sheets && (
                <p className="text-red-500">{errors.study_sheets}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="stateS"
                className="block mb-2 dark:text-white font-medium"
              >
                Etapa:<span className="text-red-500">*</span>
              </label>
              <select
                id="stateS"
                value={stateS}
                onChange={(e) => setStateS(e.target.value)}
                className={`block w-full p-2.5 border ${errors.stateS ? "border-red-500" : "border-custom-blues"
                  } rounded-lg text-gray-500 focus:ring-custom-green focus:border-custom-green focus:outline-none dark:bg-gray-700 dark:border-${errors.stateS ? "red-500" : "green-500"
                  } dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              >
                <option value="">Selecciona la etapa:</option>
                <option value="INDUCCION">INDUCCION</option>
                <option value="LECTIVA">LECTIVA</option>
                <option value="PRACTICA">PRACTICA</option>
              </select>
              {errors.stateS && <p className="text-red-500">{errors.stateS}</p>}
            </div>

          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-custom-blues dark:border-green-500">
          <button
            type="button"
            className="flex items-center text-white bg-custom-green hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            onClick={handleSave}
          >
            <FiSave className="mr-2" />{" "}
            Guardar registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
