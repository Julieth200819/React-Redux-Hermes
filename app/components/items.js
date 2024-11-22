"use client";
import { IoIosHome } from "react-icons/io";
import { PiBuildingsFill } from "react-icons/pi";
import { IoCalendarClear } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { MdEditCalendar } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { BsLaptopFill } from "react-icons/bs";
import { BsGraphUp } from "react-icons/bs";
import { ImBlocked } from "react-icons/im";
import { FaChessPawn } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { FaBuildingColumns } from "react-icons/fa6";
import { RiBook2Fill } from "react-icons/ri";
import { GiJourney } from "react-icons/gi";


export const adminSidebarItems = [
  { name: "Inicio", href: "/homeView", icon: <IoIosHome className="w-5 h-5" /> },
  { name: "Centros de Formacion", href: "/trainingCentersView", icon: <FaBuildingColumns className="w-5 h-5" /> },
  { name: "Sedes", href: "/", icon: <PiBuildingsFill className="w-5 h-5" /> },
  { name: "Ambientes", href: "/", icon: <FaChalkboardTeacher className="w-5 h-5" /> },
  { name: "Fichas", href: "/sheetsView", icon: <FaChessPawn className="w-5 h-5" /> },
  { name: "Jornadas", href: "/journeyView", icon: <GiJourney className="w-5 h-5" /> },
  { name: "Personas", href: "/peopleView", icon: <IoPerson className="w-5 h-5" /> },
  { name: "Carnet", href: "/cardView", icon: <FaAddressCard className="w-5 h-5" /> },
  { name: "Reportes", href: "/movementsOtherGraphics", icon: <BsGraphUp className="w-5 h-5" /> },
  { name: "Movimientos", href: "/movementsView", icon: <FaClock className="w-5 h-5" /> },
  { name: "Equipos", href: "/equipmentView", icon: <BsLaptopFill className="w-5 h-5" /> },
  {
    name: "Eventos",
    icon: <IoCalendarClear className="w-5 h-5" />,
    dropdown: [
      { name: "Consulta de eventos", href: "/eventsView", icon: <MdEditCalendar className="w-5 h-5" /> },
      { name: "Invitados", href: "/guestView", icon: <FaUserGroup className="w-5 h-5" /> },
    ],
  },
  { name: "Usuarios bloqueados", href: "/blockedUsers", icon: <ImBlocked className="w-5 h-5" /> },
];

export const coordinationSidebarItems = [
  { name: "Inicio", href: "/coordinatorView", icon: <IoPerson className="w-5 h-5" /> },
  {
    name: "Eventos",
    icon: <IoCalendarClear className="w-5 h-5" />,
    dropdown: [
      { name: "Consulta de eventos", href: "/eventsView", icon: <MdEditCalendar className="w-5 h-5" /> },
      { name: "Invitados", href: "/guestView", icon: <FaUserGroup className="w-5 h-5" /> },
    ],
  },

];


