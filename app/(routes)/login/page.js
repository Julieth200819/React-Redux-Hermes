"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HiLockClosed } from "react-icons/hi";
import { BsPersonCircle } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import Image from "next/image";
import logoSena from "../../../public/Img/LogoSena.png";
import { useRouter } from "next/navigation";
import logo from "../../../public/Img/logo.png";
import logowhite from "../../../public/Img/logowhite.png";
import loginService from "@/app/services/loginService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [documentType, setDocumentType] = useState("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "documentType") setDocumentType(value);
    else if (name === "documentNumber") setDocument(value);
    else if (name === "password") setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita la recarga del formulario

    const data = { documentType, document, password };

    try {
      const token = await loginService.postDocumentType(data);
      if (token) {
        localStorage.setItem("userDocument", document);
        router.push("/dashboard"); // Redirige a la vista correspondiente
      }
    } catch (error) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }
  };

  

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="w-full h-full flex justify-between items-center">
        <div className="xl:w-1/2 h-full flex justify-center items-center sm:w-full">
          <div className="xl:w-1/2 p-5 sm:">
            <div className="flex items-center">
              <div>
                <Image src={logo} alt="logo" className="w-11 h-auto" />
              </div>
              <div className="flex flex-col px-2 text-custom-blue">
                <h1 className="text-3xl font-medium">Hermes</h1>
                <p className="text-[13px] font-light">
                  Transformando vidas, construyendo futuro.
                </p>
              </div>
            </div>
            <div className="text-custom-blue pt-10">
              <h1 className="text-3xl font-medium">Inicia Sesión</h1>
              <p className="text-base pt-5">
                ¡Bienvenido de vuelta! Por favor, inicia sesión para acceder a
                tu cuenta.
              </p>
            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            <div className="mt-5">
              <form onSubmit={handleLogin}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiMiniIdentification className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <select
                      name="documentType"
                      value={documentType}
                      onChange={handleChange}
                      className="outline-none text-sm w-full h-9 mr-10 bg-white text-gray-500"
                    >
                      <option value="">Tipo de documento</option>
                      <option value="CC">Cédula de Ciudadania</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="CE">Cédula Extranjería</option>
                      <option value="PP">Pasaporte</option>
                      <option value="PEP">
                        Permiso Especial de Permanencia
                      </option>
                      <option value="PPT">
                        Permiso de Protección Temporal
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center w-full mt-4 rounded border-solid border-2 text-custom-blue">
                    <BsPersonCircle className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <input
                      value={document}
                      type="text"
                      name="documentNumber"
                      placeholder="Documento"
                      className="outline-none text-sm w-full h-9 text-custom-blue"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center w-full mt-4 rounded border-solid border-2">
                    <HiLockClosed className="w-5 mr-2 mx-3 h-5 text-gray-500" />
                    <input
                      value={password}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña"
                      className="outline-none text-sm w-full h-9 text-custom-blue"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="mx-3 text-gray-500 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-5 h-5" />
                      ) : (
                        <FaEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-4 items-center text-custom-blue">
                  <div className="flex text-center">
                    <input type="checkbox" className="mr-2" />
                    <label htmlFor="" className="text-xs">
                      Recordar
                    </label>
                  </div>
                  <div className="text-xs">
                    <Link href="">
                      <p className="hover:text-custom-blues">
                        ¿Olvidó su contraseña?
                      </p>
                    </Link>
                  </div>
                </div>
                <button
                  className="bg-custom-blue w-full p-2 text-white font-medium rounded mt-10 hover:bg-custom-blues"
                  type="submit"
                >
                  Iniciar Sesion
                </button>
              </form>
            </div>
          </div>
        </div>
        <div
          className="w-[50%] justify-center items-center bg-cover bg-center h-screen hidden xl:block"
          style={{ backgroundImage: "url('/Img/fondo1.jpg')" }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 h-full flex flex-col justify-between p-10 text-center text-white">
              <div className="w-16">
                <Image src={logoSena} alt="logoSena" className="w-full" />
              </div>
              <div className="flex justify-center">
                <div
                  className="rounded-md relative"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.0)" }}
                >
                  <p className="text-xl text-left px-4 py-4">
                    ¡Únete a la comunidad educativa del SENA y <br />
                    potencia tu futuro! Regístrate ahora para <br />
                    acceder a una amplia gama de programas de <br />
                    formación y oportunidades de crecimiento <br />
                    profesional.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 mb-12">
                <div>
                  <Image src={logowhite} alt="logowhite" className="w-11" />
                </div>
                <div className="ml-2">
                  <h1 className="text-2xl font-medium">Hermes</h1>
                  <p className="text-[8px] font-light">
                    Transformando vidas, construyendo futuro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
