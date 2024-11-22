"use client";
import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack, IoMdAdd } from "react-icons/io";
import { CiExport, CiSearch } from "react-icons/ci";
import Spinner from '../components/loadingSpinner';
import dynamic from 'next/dynamic';

const Table = ({ columns, data, title, showButton, buttonText, OpenModalAdd, renderActions, loading, showExportButton }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex flex-col items-center pt-4 max-w-full mx-auto px-2 sm:px-6 lg:px-8">
            {title && (
                <div className="flex items-center justify-between mt-12 max-w-full mx-auto px-2 sm:px-6 lg:px-8 w-full lg:w-11/12">
                    <div className="text-2xl font-medium text-custom-blue text-left lg:text-left">
                        {title}
                    </div>
                    {showButton && (
                        <button
                            className="w-auto ml-4 bg-white text-custom-green flex items-center space-x-2 py-2 px-4 focus:outline-none rounded-lg border border-custom-green dark:text-custom-blue hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:hover:bg-slate-400 h-8"
                            onClick={OpenModalAdd}
                        >
                            <IoMdAdd className="w-5 h-5 " />
                            <span>{buttonText}</span>
                        </button>
                    )}
                </div>
            )}

            <div className="relative shadow-md sm:rounded-2xl max-w-full mx-auto mt-4 w-full lg:w-11/12 animate__animated animate__fadeIn">
                <div className="bg-custom-blues dark:bg-custom-blue flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 p-4">
                    <div className="relative w-full sm:w-auto flex-grow">
                        <CiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-8 p-2 border border-gray-300 rounded-md w-full sm:w-60 h-8"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {showExportButton && (
                        <button className="flex items-center justify-center py-2 px-4 text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none h-8">
                            <span className="hidden sm:inline">Exportar</span>
                            <CiExport />
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto text-center mt-4 italic text-gray-500">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs bg-slate-50 text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column.key} scope="col" className="px-4 py-3">
                                                {column.title}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center p-8">
                                                No hay datos disponibles.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((row, index) => (
                                            <tr key={row.id || index} className="border-b dark:border-gray-700">
                                                {columns.map((column) => (
                                                    <td key={`${row.id}-${column.key}`} className="px-4 py-3">
                                                        {column.key === 'action' ? renderActions(row) : row[column.key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>

                <nav className="flex justify-between items-center p-4 dark:bg-gray-800" aria-label="Table navigation">
                    <span className="text-sm font-normal text-gray-700 dark:text-gray-400">
                        Muestra
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}
                        </span>
                        de
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {filteredData.length}
                        </span>
                    </span>
                    <ul className="inline-flex items-center -space-x-px">
                        <li>
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <span className="sr-only">Previous</span>
                                <IoIosArrowBack />
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, pageIndex) => (
                            <li key={pageIndex}>
                                <button
                                    onClick={() => handlePageClick(pageIndex + 1)}
                                    aria-current={currentPage === pageIndex + 1 ? 'page' : undefined}
                                    className={`flex items-center justify-center text-sm py-1.5 px-3 leading-tight border hover:bg-slate-100 border-gray-300 ${currentPage === pageIndex + 1 ? 'text-primary-600 bg-primary-50 border-primary-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                                >
                                    {pageIndex + 1}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <span className="sr-only">Next</span>
                                <IoIosArrowForward />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(Table), { ssr: false });
