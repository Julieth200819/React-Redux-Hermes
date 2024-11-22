"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic"; // Importar dynamic de Next.js
import logo from "../../public/Img/logowhite.png";
import { IoPerson } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaChessPawn, FaUsers } from "react-icons/fa";
import { PiBuildingsFill, PiChalkboardTeacherFill } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { RiBook2Fill } from "react-icons/ri";
import { GiJourney } from "react-icons/gi";
import { BsTools } from "react-icons/bs";
import { ImProfile } from "react-icons/im";


// MANEJO DE ICONOS DE MANERA DINAMICA
const IoCalendarClear = dynamic(() => import("react-icons/io5").then((mod) => mod.IoCalendarClear), { ssr: false });
const BsLaptopFill = dynamic(() => import("react-icons/bs").then((mod) => mod.BsLaptopFill), { ssr: false });
const IoIosArrowDown = dynamic(() => import("react-icons/io").then((mod) => mod.IoIosArrowDown), { ssr: false });
const IoIosArrowUp = dynamic(() => import("react-icons/io").then((mod) => mod.IoIosArrowUp), { ssr: false });
const IoIosHome = dynamic(() => import("react-icons/io").then((mod) => mod.IoIosHome), { ssr: false });
const MdEditCalendar = dynamic(() => import("react-icons/md").then((mod) => mod.MdEditCalendar), { ssr: false });
const FaUserGroup = dynamic(() => import("react-icons/fa6").then((mod) => mod.FaUserGroup), { ssr: false });
const FaAddressCard = dynamic(() => import("react-icons/fa").then((mod) => mod.FaAddressCard), { ssr: false });
const HiSwitchHorizontal = dynamic(() => import("react-icons/hi").then((mod) => mod.HiSwitchHorizontal), { ssr: false });
const FaMoon = dynamic(() => import("react-icons/fa").then((mod) => mod.FaMoon), { ssr: false });
const MdSunny = dynamic(() => import("react-icons/md").then((mod) => mod.MdSunny), { ssr: false });

const Sidebar = ({ userRole }) => {
  const [showMenu] = useState(false);
  const [isOpenFormation, setIsOpenFormation] = useState(false);
  const [isOpenEvents, setIsOpenEvents] = useState(false);
  const [isOpenTools, setIsOpenTools] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const role = localStorage.getItem("role");

  useEffect(() => {
    console.log("role: ", role
    )
    const savedMode = localStorage.getItem("darkMode") === "true";
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(savedMode ?? prefersDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const superadminSidebarItems = [
    { name: "Inicio", href: "/dashboard", icon: <IoIosHome className="w-5 h-5" /> },
    {
      name: "Formación",
      icon: <IoCalendarClear className="w-5 h-5" />,
      dropdown: [
        { name: "Centros de Formación", href: "/dashboard/trainingCentersView", icon: <FaBuildingColumns className="w-5 h-5" /> },
        { name: "Sedes", href: "/dashboard/headquartersView", icon: <PiBuildingsFill className="w-5 h-5" /> },
        { name: "Coordinaciones", href: "/dashboard/coordinationsView", icon: <FaUserTie className="w-5 h-5" /> },
        { name: "Ambientes", href: "/dashboard/environmentView", icon: <FaChalkboardTeacher className="w-5 h-5" /> },
        { name: "Programas", href: "/dashboard/programView", icon: <RiBook2Fill className="w-5 h-5" /> },
        { name: "Jornadas", href: "/dashboard/journeyView", icon: <GiJourney className="w-5 h-5" /> },
        { name: "Fichas", href: "/dashboard/sheetView", icon: <FaChessPawn className="w-5 h-5" /> },
      ],
    },
    { name: "Estudiantes", href: "/dashboard/studentsView", icon: <IoPerson className="w-5 h-5" /> },
    { name: "Instructores", href: "/dashboard/instructorsView", icon: <PiChalkboardTeacherFill className="w-5 h-5" /> },
    { name: "Carnet", href: "/dashboard/cardView", icon: <FaAddressCard className="w-5 h-5" /> },
    { name: "Movimientos", href: "/dashboard/movementsView", icon: <HiSwitchHorizontal className="w-5 h-5" /> },
    { name: "Equipos", href: "/dashboard/equipmentView", icon: <BsLaptopFill className="w-5 h-5" /> },
    {
      name: "Eventos",
      icon: <IoCalendarClear className="w-5 h-5" />,
      dropdown: [
        { name: "Consulta de eventos", href: "/dashboard/eventsView", icon: <MdEditCalendar className="w-5 h-5" /> },
        { name: "Invitados", href: "/dashboard/guestView", icon: <FaUserGroup className="w-5 h-5" /> },
      ],
    },
    {
      name: "Herramientas",
      icon: <BsTools className="w-5 h-5" />,
      dropdown: [
        { name: "Gestión de Usuarios", href: "/dashboard/userManagementView", icon: <FaUsers className="w-5 h-5" /> },
      ],
    },
  ];
  
  // ITEMS PARA ADMINISTRADOR
  const adminSidebarItems = [
    { name: "Inicio", href: "/dashboard", icon: <IoIosHome className="w-5 h-5" /> },
    { name: "Perfil", href: "/dashboard/cardView", icon: <FaAddressCard className="w-5 h-5" /> },
    {
      name: "Formación",
      icon: <IoCalendarClear className="w-5 h-5" />,
      dropdown: [
        { name: "Centros de Formación", href: "/dashboard/trainingCentersView", icon: <FaBuildingColumns className="w-5 h-5" /> },
        { name: "Sedes", href: "/dashboard/headquartersView", icon: <PiBuildingsFill className="w-5 h-5" /> },
        { name: "Coordinaciones", href: "/dashboard/coordinationsView", icon: <FaUserTie className="w-5 h-5" /> },
        { name: "Ambientes", href: "/dashboard/environmentView", icon: <FaChalkboardTeacher className="w-5 h-5" /> },
        { name: "Programas", href: "/dashboard/programView", icon: <RiBook2Fill className="w-5 h-5" /> },
        { name: "Jornadas", href: "/dashboard/journeyView", icon: <GiJourney className="w-5 h-5" /> },
        { name: "Fichas", href: "/dashboard/sheetView", icon: <FaChessPawn className="w-5 h-5" /> },
      ],
    },
    { name: "Estudiantes", href: "/dashboard/studentsView", icon: <IoPerson className="w-5 h-5" /> },
    { name: "Instructores", href: "/dashboard/instructorsView", icon: <PiChalkboardTeacherFill className="w-5 h-5" /> },
    { name: "Movimientos", href: "/dashboard/movementsView", icon: <HiSwitchHorizontal className="w-5 h-5" /> },
    { name: "Equipos", href: "/dashboard/equipmentView", icon: <BsLaptopFill className="w-5 h-5" /> },
    {
      name: "Eventos",
      icon: <IoCalendarClear className="w-5 h-5" />,
      dropdown: [
        { name: "Consulta de eventos", href: "/dashboard/eventsView", icon: <MdEditCalendar className="w-5 h-5" /> },
        { name: "Invitados", href: "/dashboard/guestView", icon: <FaUserGroup className="w-5 h-5" /> },
      ],
    },
    {
      name: "Herramientas",
      icon: <BsTools className="w-5 h-5" />,
      dropdown: [
        { name: "Gestión de Usuarios", href: "/dashboard/userManagementView", icon: <FaUsers className="w-5 h-5" /> },
      ],
    },
  ];


  // ITEMS PARA EL COORDINADOR //
  const coordinatorSidebarItems = [
    { name: "Inicio", href: "/dashboard/dashboard", icon: <IoIosHome className="w-5 h-5" /> },
    { name: "Perfil", href: "/dashboard/cardView", icon: <FaAddressCard className="w-5 h-5" /> },
    {
      name: "Formación",
      icon: <IoCalendarClear className="w-5 h-5" />,
      dropdown: [
        { name: "Jornadas", href: "/dashboard/journeyView", icon: <GiJourney className="w-5 h-5" /> },
        { name: "Programas", href: "/dashboard/programView", icon: <RiBook2Fill className="w-5 h-5" /> },
        { name: "Ambientes", href: "/dashboard/environmentView", icon: <FaChalkboardTeacher className="w-5 h-5" /> },
        { name: "Fichas", href: "/dashboard/sheetView", icon: <FaChessPawn className="w-5 h-5" /> },
      ],
    },
    { name: "Instructores", href: "/dashboard/instructorsView", icon: <PiChalkboardTeacherFill className="w-5 h-5" /> },
    { name: "Estudiantes", href: "/dashboard/studentsView", icon: <IoPerson className="w-5 h-5" /> },
    { name: "Eventos", href: "/dashboard/eventsView", icon: <IoCalendarClear className="w-5 h-5" /> },
  ];


  // ITEMS PARA EL INSTRUCTOR //
  const instructorSidebarItems = [
    { name: "Inicio", href: "/dashboard/dashboard", icon: <IoIosHome className="w-5 h-5" /> },
    { name: "Perfil", href: "/dashboard/cardView", icon: <FaAddressCard className="w-5 h-5" /> },
    {
      name: "Gestión de Formación",
      icon: <IoCalendarClear className="w-5 h-5" />,
      dropdown: [
        { name: "Centros de Formación", href: "/dashboard/trainingCentersView", icon: <FaBuildingColumns className="w-5 h-5" /> },
        { name: "Jornadas", href: "/journeyView", icon: <GiJourney className="w-5 h-5" /> },
      ],
    },
    { name: "Eventos", href: "/dashboard/eventsView", icon: <IoCalendarClear className="w-5 h-5" /> },
    { name: "Estudiantes", href: "/dashboard/studentsView", icon: <IoPerson className="w-5 h-5" /> },
  ];


  // ITEMS PARA APOYO COORDINACION //
  const supportCoordinationSidebarItems = [
    { name: "Inicio", href: "/dashboard/dashboard", icon: <IoIosHome className="w-5 h-5" /> },
    { name: "Perfil", href: "/dashboard/cardView", icon: <FaAddressCard className="w-5 h-5" /> },
    {
      name: "Formación",
      icon: <IoCalendarClear className="w-5 h-5" />,
      dropdown: [
        { name: "Jornadas", href: "/dashboard/journeyView", icon: <GiJourney className="w-5 h-5" /> },
        { name: "Programas", href: "/dashboard/programView", icon: <RiBook2Fill className="w-5 h-5" /> },
        { name: "Ambientes", href: "/dashboard/environmentView", icon: <FaChalkboardTeacher className="w-5 h-5" /> },
        { name: "Fichas", href: "/dashboard/sheetView", icon: <FaChessPawn className="w-5 h-5" /> },
      ],
    },
    { name: "Instructores", href: "/dashboard/instructorsView", icon: <PiChalkboardTeacherFill className="w-5 h-5" /> },
    { name: "Estudiantes", href: "/dashboard/studentsView", icon: <IoPerson className="w-5 h-5" /> },
    { name: "Eventos", href: "/dashboard/eventsView", icon: <IoCalendarClear className="w-5 h-5" /> },
  ];


  // ITEM PARA PERSONA DE SEGURIDAD //
  const securityPersonSidebarItems = [
    { name: "Inicio", href: "/dashboard/dashboard", icon: <IoIosHome className="w-5 h-5" /> },
    { name: "Movimientos", href: "/dashboard/movementsView", icon: <HiSwitchHorizontal className="w-5 h-5" /> },
  ];


  // ITEMS PARA EL APRENDIZ //
  const apprenticeSidebarItems = [
    { name: "Carnet", href: "/dashboard/cardView", icon: <FaAddressCard className="w-5 h-5" /> },
    { name: "Mis Equipos", href: "/dashboard/equipmentView", icon: <BsLaptopFill className="w-5 h-5" /> },

  ];


  // Determinar qué elementos del sidebar se deben renderizar según el rol del usuario
  let sidebarItems = null;
  
  if(role === 'ROLE_apprentice'){
     sidebarItems = apprenticeSidebarItems 
  
    }else if(role === "ROLE_SUPER ADMIN" ){
      sidebarItems = superadminSidebarItems;
    }else if(role === "ROLE_ADMIN" ){
      sidebarItems = adminSidebarItems;
    }else if(role === "ROLE_COORDINATOR"){
      sidebarItems = coordinatorSidebarItems;
    }else if(role === "ROLE_SEGURIDAD"){
      sidebarItems = securityPersonSidebarItems;
    }else if(role === "ROLE_INSTRUCTOR"){
      sidebarItems = instructorSidebarItems;
    }
    else{
     sidebarItems = apprenticeSidebarItems; 
    }
    

  return (
    <div className={`min-h-screen overflow-y-auto shadow-xl fixed xl:static bg-white dark:bg-custom-blue w-[60%] md:w-[40%] lg:w-[30%] xl:w-auto border-r rounded-md border-gray-300 dark:border-gray-600 -left-full top-0 p-8 z-50 flex flex-col justify-between transition-all text-white ${showMenu ? "left-0" : "-left-full"}`}>
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-12">
          <Image src={logo} alt="logo" className="w-11" />
          <div className="ml-2 mt-7 text-custom-blues dark:text-white">
            <h1 className="text-2xl font-medium">Hermes</h1>
            <p className="text-[12px] font-light">Transformando vidas, construyendo futuro.</p>
          </div>
        </div>
        <ul className="text-gray-500 mt-12 dark:text-white">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              {item.dropdown ? (
                <>
                  <div
                    onClick={() => {
                      if (item.name === "Formación") {
                        setIsOpenFormation(!isOpenFormation);
                      } else if (item.name === "Eventos") {
                        setIsOpenEvents(!isOpenEvents);
                      } else if (item.name === "Herramientas") {
                        setIsOpenTools(!isOpenTools);
                      }
                    }}
                    className="flex items-center gap-4 py-4 px-4 border-2 border-transparent hover:rounded-2xl dark:hover:bg-narvy-blue dark:hover:border-transparent hover:text-custom-blues dark:hover:text-white hover:border-custom-blues hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full text-left"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {(item.name === "Formación" && isOpenFormation) ||
                      (item.name === "Eventos" && isOpenEvents) ||
                      (item.name === "Herramientas" && isOpenTools) ? (
                      <IoIosArrowUp className="ml-auto" />
                    ) : (
                      <IoIosArrowDown className="ml-auto" />
                    )}
                  </div>
                  {(item.name === "Formación" && isOpenFormation) ||
                    (item.name === "Eventos" && isOpenEvents) ||
                    (item.name === "Herramientas" && isOpenTools) ? (
                    <ul className="ml-6 mt-2 space-y-2">
                      {item.dropdown.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className="flex items-center gap-4 py-4 px-4 border-2 border-transparent hover:rounded-2xl dark:hover:bg-narvy-blue dark:hover:border-transparent hover:text-custom-blues dark:hover:text-white hover:border-custom-blues hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full text-left"
                          >
                            {subItem.icon}
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <Link href={item.href} className="flex items-center gap-4 py-4 px-4 border-2 border-transparent hover:rounded-2xl dark:hover:bg-narvy-blue dark:hover:border-transparent hover:text-custom-blues dark:hover:text-white hover:border-custom-blues hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full text-left">
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center gap-4 py-4 px-4 border-custom-blues text-custom-blues dark:text-white hover:border-custom-blues hover:shadow-lg transition-all duration-300 ease-in-out"
      >
        {darkMode ? <MdSunny className="text-2xl" /> : <FaMoon className="text-2xl" />}
      </button>

    </div>
  );
};

export default dynamic(() => Promise.resolve(Sidebar), { ssr: false }); // Usar dynamic para la exportación del componente
