"use client";
import React, { useState } from 'react';
import { CiExport } from "react-icons/ci";
import 'animate.css';
import * as XLSX from 'xlsx';
import studentsService from '../services/studentsService';
import { notifySuccess, notifyError } from '../components/notification';

const TableMassive = ({ title }) => {
  const [searchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const rowsPerPage = 5;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

        setHeaders(json[0].map(item => String(item)));

        const rows = json.slice(1).map(row => {
          switch (row[0]) {
            case 'TI': row[0] = 1; break;
            case 'CC': row[0] = 2; break;
            case 'CE': row[0] = 3; break;
            case 'PEP': row[0] = 4; break;
            case 'PPT': row[0] = 5; break;
          }
          return {
            data: {
              document_type: row[0],
              document: String(row[1]),
              name: String(row[2]),
              lastname: String(row[3]),
              phone: String(row[4]),
              email: String(row[5]),
              stateS: String(row[6]),
              study_sheet: String(row[7] || ''),
              stateP: "true"
            }
          };
        });

        setData(rows);
        setCombinedData(rows);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAddUsers = async () => {
    try {
      const response = await studentsService.postMassiveStudent(combinedData);
      notifySuccess("Estudiantes agregados con éxito")
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col items-center pt-4 max-w-full mx-auto px-2 sm:px-6 lg:px-8">
      {title && (
        <div className="flex items-center justify-between mt-12 max-w-full mx-auto px-2 sm:px-6 lg:px-8 w-full lg:w-3/4">
          <div className="text-2xl font-medium text-custom-blue text-left lg:text-left">
            {title}
          </div>
        </div>
      )}

      <div className="relative shadow-md sm:rounded-2xl max-w-full mx-auto mt-4 overflow-hidden w-full lg:w-3/4 animate__animated animate__fadeIn">
        <div className="bg-custom-blues dark:bg-custom-blue flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 p-4">
          <div className="flex space-x-2">
            <button
              onClick={handleAddUsers}
              className="flex items-center justify-center py-2 px-4 text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none h-8"
            >
              <span className="hidden sm:inline">Agregar usuarios </span>
              <CiExport />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div>
            <div className="bg-white p-6 rounded-lg grid content-center">
              <div className="mt-4 ">
                <label className="block text-md mb-4 font-medium text-gray-700">
                  Selecciona un archivo (CSV/Excel):
                </label>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                  className="block w-1/2 text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">Archivos tipo CSV o Excel</p>
                {data.length > 0 && (
                  <>
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                      <thead>
                        <tr className="bg-gray-100">
                          {headers.map((header, index) => (
                            <th key={index} className="px-4 py-2 text-left font-medium text-gray-600">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {Object.values(row.data).map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 border-b border-gray-200">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center mt-4">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mr-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                      >
                        Anterior
                      </button>
                      <span>
                        Página {currentPage} de {pageCount}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage >= pageCount}
                        className="px-4 py-2 ml-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                      >
                        Siguiente
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableMassive;
