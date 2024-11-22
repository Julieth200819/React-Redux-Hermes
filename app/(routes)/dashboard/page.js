"use client"
import React from 'react';
import Image from 'next/image';
import logo from "../../../public/Img/logo.png";

export default function movementsHome() {
  return (
        <div className="xl:col-span-5 ">
          <div className='flex justify-center items-cente mb-4 mt-4'>
          <Image src={logo} alt="logo" className="w-14 mr-4" /><p className='flex justify-center font-bold items-center text-4xl underline'>Bienvenido a Hermes</p> <Image src={logo} alt="logo" className="w-14 ml-4 " />
                        </div>
          <div className='flex justify-center items-center'>
            
          <div className='bg-slate-300 w-10/12 h-5/6 flex justify-center items-center mt-5 '>
              <p className='font-medium m-6'>Bienvendio a Hermes, este es un aplicativo en el cual se  registra y evidenciaran los 
              movimientos de entrada y salida de nuestras sedes de calle 65 y salitre .<br /><br />
              Puedes realizar las siguientes gestiones:<br />
              Visualizar entradas y salidas de nuestras instalaciones .<br />
              Registrar equipos personales .<br />
              Generar reportes.<br /><br />
              Esperamos ser un aliado comodo y eficiente para ti. </p>
          </div>
          </div>
        </div>
   
  )
}