"use client"
import React from 'react';
import { CiSearch } from "react-icons/ci";
import Link from 'next/link'

export default function guestCoordinationView({}) {
 
  return (
      <div className="xl:col-span-5">
        <div className="text-2xl font-medium text-custom-blue text-left lg:text-left mt-12 max-w-full mx-auto px-2 sm:px-6 lg:px-8 w-full lg:w-3/4">
          Detalles de eventos
        </div>
        <div className="relative w-full flex justify-center">
          <div className="relative w-full sm:w-64">
            <CiSearch 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" 
              size={24} 
            />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-12 p-2 bg-custom-blue placeholder-white rounded-lg w-full h-8 text-white"
            />
          </div>
        </div>

        {/* Aquí aplicamos el grid para que las tarjetas siempre se organicen en filas de 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-center">
          <div className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
            <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">Inteligencia <br/> Artificial</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="text-gray-600">
                <h4>Fecha:</h4>
                <p>09/09/2024</p>
                <h4>Hora:</h4>
                <p>09:00am-10:30am</p>
              </div>
              <div className="text-gray-600">
                <h4>Ambiente:</h4>
                <p>201</p>
                <h4>Organizador:</h4>
                <p>Diana Yepes</p>
              </div>
              <div className="flex justify-end mt-4 col-span-2">
              <Link href="/peopleTable" className="bg-custom-blues text-white rounded-lg px-3 py-2">
                  Ver invitados
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
            <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">Desarrollo <br/> Web</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="text-gray-600">
                <h4>Fecha:</h4>
                <p>10/10/2024</p>
                <h4>Hora:</h4>
                <p>10:00am-12:00pm</p>
              </div>
              <div className="text-gray-600">
                <h4>Ambiente:</h4>
                <p>102</p>
                <h4>Organizador:</h4>
                <p>Laura García</p>
              </div>
              <div className="flex justify-end mt-4 col-span-2">
                <button className="bg-custom-blues text-white rounded-lg px-3 py-2">
                  Ver invitados
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
            <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">Ciber <br/> seguridad</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="text-gray-600">
                <h4>Fecha:</h4>
                <p>15/09/2024</p>
                <h4>Hora:</h4>
                <p>02:00pm-04:00pm</p>
              </div>
              <div className="text-gray-600">
                <h4>Ambiente:</h4>
                <p>303</p>
                <h4>Organizador:</h4>
                <p>Luis Martínez</p>
              </div>
              <div className="flex justify-end mt-4 col-span-2">
                <button className="bg-custom-blues text-white rounded-lg px-3 py-2">
                  Ver invitados
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
            <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">Desarrollo <br/> Web</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="text-gray-600">
                <h4>Fecha:</h4>
                <p>10/10/2024</p>
                <h4>Hora:</h4>
                <p>10:00am-12:00pm</p>
              </div>
              <div className="text-gray-600">
                <h4>Ambiente:</h4>
                <p>102</p>
                <h4>Organizador:</h4>
                <p>Laura García</p>
              </div>
              <div className="flex justify-end mt-4 col-span-2">
                <button href="/peopleTable" className="bg-custom-blues text-white rounded-lg px-3 py-2">
                  Ver invitados
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
            <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">Ciber <br/> seguridad</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="text-gray-600">
                <h4>Fecha:</h4>
                <p>15/09/2024</p>
                <h4>Hora:</h4>
                <p>02:00pm-04:00pm</p>
              </div>
              <div className="text-gray-600">
                <h4>Ambiente:</h4>
                <p>303</p>
                <h4>Organizador:</h4>
                <p>Luis Martínez</p>
              </div>
              <div className="flex justify-end mt-4 col-span-2">
                <button className="bg-custom-blues text-white rounded-lg px-3 py-2">
                  Ver invitados
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
            <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">Desarrollo <br/> Web</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="text-gray-600">
                <h4>Fecha:</h4>
                <p>10/10/2024</p>
                <h4>Hora:</h4>
                <p>10:00am-12:00pm</p>
              </div>
              <div className="text-gray-600">
                <h4>Ambiente:</h4>
                <p>102</p>
                <h4>Organizador:</h4>
                <p>Laura García</p>
              </div>
              <div className="flex justify-end mt-4 col-span-2">
                <button className="bg-custom-blues text-white rounded-lg px-3 py-2">
                  Ver invitados
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border-gray-300 border rounded-lg shadow-xl px-6 py-6">
            <h2 className="text-3xl text-center text-custom-blue border-b border-custom-blues font-medium">Ciber <br/> seguridad</h2>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="text-gray-600">
                <h4>Fecha:</h4>
                <p>15/09/2024</p>
                <h4>Hora:</h4>
                <p>02:00pm-04:00pm</p>
              </div>
              <div className="text-gray-600">
                <h4>Ambiente:</h4>
                <p>303</p>
                <h4>Organizador:</h4>
                <p>Luis Martínez</p>
              </div>
              <div className="flex justify-end mt-4 col-span-2">
                <button className="bg-custom-blues text-white rounded-lg px-3 py-2">
                  Ver invitados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}