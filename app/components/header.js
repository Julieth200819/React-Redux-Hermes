"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import peopleService from "../services/peopleService";


const Header = () => {
  const [peopleData, setPeopleData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPeople = async () => {
    const userDocumentStr = String(localStorage.getItem("userDocument"));
    if (!userDocumentStr) return;

    try {
      const response = await peopleService.getPersonByDocument(userDocumentStr);
      setPeopleData(response.data);
    } catch (e) {
      console.error("Error fetching data:", e);
      setError("No se pudo obtener la información del usuario.");
    }

  };


  useEffect(() => {
    fetchPeople();
  }, []);
  return (
    <header className="w-[98%] md:h-[12vh] lg:h-[10vh] mx-auto mt-2 flex items-center justify-between px-5 lg:py-5 drop-shadow-lg lg:px-4 border rounded-2xl bg-custom-blues dark:bg-custom-blue dark:border-gray-600 border-gray-300">
      <div className="flex items-center">
        <Image src="/Img/logoSena3.png" className="m-3" width={70} height={460} alt="Logo" />
        <span className="ml-3 text-2xl font-semibold text-white dark:text-dark">Hermes</span>
      </div>
      <Link href="/dashboard/cardView" className="flex items-center gap-2 py-3 px-4 hover:bg-lime-500 dark:hover:bg-lime-500 rounded-xl transition-colors">
        <div className="flex flex-col text-xl font-medium text-white">
          <span className="text-end">{peopleData ? peopleData.data.name +" "+ peopleData.data.lastname : "Cargando..."}</span>
        </div>
        {peopleData && peopleData.photo ? (
                <Image 
                    src={peopleData.photo} 
                    alt="Perfil" 
                    className=" object-cover rounded-full" 
                    width={1000} 
                    height={760} 
                />
            ) : (
              <IoPersonCircleSharp className="w-10 h-10 text-gray-500" />
            )}
      </Link>
    </header>
  );
};

export default React.memo(Header);
