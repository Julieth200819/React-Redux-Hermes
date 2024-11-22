'use client';
import Image from "next/image";
import { useState } from 'react';
import imgMobile1 from "../public/Img/imgMobile1.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaTwitter, FaTiktok, FaFacebook } from "react-icons/fa";
import { faCircleCheck, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { Link as ScrollLink } from 'react-scroll';
import logowhite from "../public/Img/logowhite.png";
import { Carousel } from 'react-responsive-carousel';
import logo from "../public/Img/logo.png";
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 


// Definición de las propiedades que tu componente va a recibir
const pellet = {
    size: "medium",
    color: "red"
    // Puedes agregar más propiedades según sea necesario
  };
  

// Definición del componente
const Bolita = ({ size, color }) => {
    return (
      <div style={{ width: size, height: size, margin: '15px 15px 0 15px', backgroundColor: color, borderRadius: 100 }}>
      </div>
    );
  };
  




export default function Home() {
  const generarBolitas = (cantidad, tamañoMinimo, tamañoMaximo) => {
    const bolitas = [];
    for (let i = 0; i < cantidad; i++) {
      const tamaño = `${Math.floor(Math.random() * (tamañoMaximo - tamañoMinimo) + tamañoMinimo)}px`;
      const opacidad = Math.random() * (0.8 - 0.2) + 0.2; // Generar un valor aleatorio de opacidad entre 0 y 1
      const pelotica = <Bolita key={i} size={tamaño} color={`rgba(0, 49, 77, ${opacidad})`} />;
      const divConPelotica = <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 }}>{pelotica}</div>; // Centrar la pelotica dentro del div
      bolitas.push(divConPelotica);
      tamañoMaximo -= 3; // Reducir el tamaño máximo para la próxima iteración
    }
    return bolitas;
  };
  

  //Funciones para carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <main className={`flex min-h-screen flex-col  overflow-hidden items-end lg:items-center bg-white `}>
      <div className="lg:container flex justify-between lg:max-w-5xl m-2 lg:m-6 px-4 sm:px-6 lg:px-8 2xl:px-6 bg-darkBlue rounded-full p-2.5 fixed z-50">
        <div className="hidden flex-col sm:flex-row lg:flex">
          <Image src={logowhite} alt="logo" width={38} className="mr-1 " />
          <div>
            <h3 className="text-white text-lg">Hermes</h3>
            <p className="text-white text-sm">Transformando vidas, construyendo futuro.</p>
          </div>
        </div>
        <div className="container max-w-xl flex items-center lg:justify-between justify-end px-6">
        <ScrollLink to="Inicio" spy={true} smooth={true} offset={-70} duration={500} className="lg:text-base hidden lg:block text-white hover:text-green" style={{ cursor: 'pointer' }} > Inicio </ScrollLink>
        <ScrollLink to="Alcance" spy={true} smooth={true} offset={-70} duration={500} className="lg:text-base hidden lg:block text-white hover:text-green" style={{ cursor: 'pointer' }} > Alcance </ScrollLink>
        <ScrollLink to="Hermes" spy={true} smooth={true} offset={-70} duration={500} className="lg:text-base hidden lg:block text-white hover:text-green" style={{ cursor: 'pointer' }} > Hermes </ScrollLink>
        <ScrollLink to="Fabrica" spy={true} smooth={true} offset={-70} duration={500} className="lg:text-base hidden lg:block text-white hover:text-green" style={{ cursor: 'pointer' }} > Fabrica de Software </ScrollLink>
          <Link href="/login" className="font-thin text-base/[15px] lg:text-base text-white hover:text-green">Ingresar</Link>
          <Image src={logowhite} alt="logowhite" width={18} className="ml-2 lg:hidden " />
        </div>
      </div>

      {/* Primera Sección */}
      <div id="Inicio" className="w-full min-h-60 flex justify-between">
        <div id="seccion1" className="container w-full lg:w-8/12  ">
          <div className="h-1/6 lg:h-1/4 w-full flex " style={{ margin: "-20px" }}>
            {/* Primer conjunto de bolitas */}
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                {generarBolitas(10, 5, 40)}
              </div>
            ))}
            {/* Segundo conjunto de bolitas */}
            {[...Array(11)].map((_, index) => (
              <div key={index}>
                {generarBolitas(5, 5, 40)}
              </div>
            ))}
            {/* Tercer conjunto de bolitas */}
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                {generarBolitas(12, 5, 40)}
              </div>
            ))}
          </div>

          <div className="h-3/4 w-full flex lg:items-center items-end justify-center">
            <div className="w-4/5 lg:w-2/4 flex flex-col justify-center items-end lg:items-start">
              <div className="flex flex-col sm:flex-row lg:w-3/4 w-2/4 items-end">
                <Image src={logo} alt="logo" width={38} className="mr-1 " />
                <div className="flex flex-col items-end lg:items-start">
                  <h3 className="text-darkBlue font-bold lg:text-4xl ">Hermes</h3>
                  <p className="text-darkBlue text-sm text-end">Transformando vidas, construyendo futuro.</p>
                </div>
              </div>

              <div className="w-full">
                <h1 className="text-darkBlue lg:text-3xl text-end lg:text-start  my-6">¡Hola y bienvenido!</h1>
                <p className="text-darkBlue lg:text-lg text-end lg:text-start ">En Hermes, te brindamos acceso rápido y sencillo a la información que necesitas para comenzar tu formación en uno de los centros educativos más importantes del país.</p>
              </div>
            </div>

          </div>

        </div>

        <div
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0),rgba(255, 255, 255, 0),rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 1)), url('/img/imagenBackground.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover', // Ajusta el tamaño de la imagen para que cubra el div
            backgroundPosition: 'center', // Centra la imagen dentro del div
            width:'100%'
          }}
          className="container hidden lg:block lg:w-6/12"
        >
        </div>

      </div>

      {/* Segunda Seccion */}
      <div id="Alcance" className="lg:min-w-full w-4/4 min-h-64 flex flex-col items-center my-6 animate-fade-in-up z-1">
        <h1 className="text-darkBlue font-bold text-xl text-center w-3/4">Funciones a tu alcance: ¡Descubre qué puedes hacer!</h1>
        <div className="flex flex-col lg:flex-row lg:w-3/4 lg:m-10 items-center justify-between">
          <div className="w-72 border border-b-slate-950 shadow-xl p-4 m-4 h-72 flex flex-col items-center justify-evenly">
            <FontAwesomeIcon icon={faCircleCheck} className="text-darkBlue w-10 h-10" />
            <h2 className="text-darkBlue text-center m-3 w-40 font-bold">Descubre quienes somos</h2>
            <p className="text-darkBlue text-xs text-center">Ofrecemos programas de formación técnica y tecnológica para potenciar tus habilidades y abrirte nuevas oportunidades laborales. ¡Únete a nosotros y construye tu futuro hoy mibaseo!</p>
          </div>
          <div className="w-72 border border-b-slate-950 shadow-xl p-4 m-4 h-72 flex flex-col items-center justify-evenly">
            <FontAwesomeIcon icon={faCircleCheck} className="text-darkBlue w-10 h-10" />
            <h2 className="text-darkBlue text-center m-3 w-40 font-bold">Centros por Ubicación</h2>
            <p className="text-darkBlue text-xs text-center">Encuentra centros del Sena cerca de ti. Explora nuestra red nacional de centros de formación y accede a oportunidades educativas en tu área local.</p>
          </div>
          <div className="w-72 border border-b-slate-950 shadow-xl p-4 m-4 h-72 flex flex-col items-center justify-evenly">
            <FontAwesomeIcon icon={faLocationDot} className="text-darkBlue w-10 h-10" />
            <h2 className="text-darkBlue text-center m-3 w-40 font-bold">Categorías de cursos</h2>
            <p className="text-darkBlue text-xs text-center">Explora nuestros centros del Sena organizados por categorías de cursos, para que puedas encontrar fácilmente la formación que se adapte a tus intereses y objetivos profesionales.</p>
          </div>
        </div>
        <div>

        </div>
      </div>

      {/* Tercera Seccion */}
      <div id="Hermes" className="lg:min-w-full lg:max-h-[37rem] flex items-center justify-center bg-darkBlue overflow-hidden">
            {/* <MapContainer   /> Mapa del las macroregiones del SENA */} 

            <div className="w-full lg:w-7/12 max-h-80 flex items-center justify-end my-8 lg:mt-16 py-32">
                <div className="w-11/12 lg:w-8/12 flex flex-col gap-11">
                  <h1 className="text-base lg:text-2xl font-bold text-white">¡Descarga nuestra Aplicación Móvil!</h1>
                  <p className="w-9/12 text-xs lg:text-lg text-white">¡Bienvenido al futuro de la educación! En Hermes, nos enorgullece presentarte nuestra innovadora aplicación móvil diseñada para simplificar tu experiencia al acceder a las sedes del Servicio Nacional de Aprendizaje (SENA). Con nuestra aplicación, encontrar y navegar por las sedes del SENA nunca ha sido más fácil y conveniente.</p>
                  <button className="text-xs lg:text-lg w-4/12 lg:w-3/12 py-2 bg-green rounded-xl"> Descargar </button>
                </div>
            </div>

            <div className="hidden w-[49rem] bg-white h-[49rem] rounded-full mt-64 lg:flex items-center" style={{ marginRight: "-13rem", marginBottom: '-3rem', boxShadow: "0 -25px 1px 15px rgba(255, 255, 250, 0.2)" }}>
              <div id="controles" className="w-2/12 h-96 flex flex-col gap-3 justify-end" style={{ marginTop: '-8rem' }}>
                    <div className={`bolita ${currentSlide === 0 ? 'active' : ''} `} onClick={() => setCurrentSlide(0)} style={{ marginLeft: '1.2rem', boxShadow: "0 3px 6px 2px rgba(200, 200, 200, 1)" }}></div>
                    <div className={`bolita ${currentSlide === 1 ? 'active' : ''} `} onClick={() => setCurrentSlide(1)} style={{ marginLeft: '2rem', boxShadow: "0 3px 6px 2px rgba(200, 200, 200, 1)" }}></div>
                    <div className={`bolita ${currentSlide === 2 ? 'active' : ''} `} onClick={() => setCurrentSlide(2)} style={{ marginLeft: '2.8rem', boxShadow: "0 3px 6px 2px rgba(200, 200, 200, 1)" }}></div>
              </div>
              <div id="movil" className="w-10/12 h-96" style={{ marginTop: '-10rem' }}>
                <div>
                  <Carousel showThumbs={false} showStatus={false} showIndicators={false} selectedItem={currentSlide}>
                      <div className="h-[32rem] w-9/12">
                        <Image src={imgMobile1} alt="Imagen Movil 1" style={{width: '220px'}} className=" lg:hidden" />
                      </div>
                    </Carousel>
                </div>
              </div>
            </div>


      </div>

      {/* Cuarta Seccion */}
      <div id="Fabrica" className="lg:min-w-full lg:min-h-3/4 flex items-center justify-center my-20">
        <div className="hidden w-6/12 lg:flex items-center justify-center">
          <div className="w-[29rem] h-[29rem] rounded-full" 
          style={{ boxShadow: "0 25px 1px 15px rgba(0, 49, 77, 0.2)", 
            backgroundImage: `url('/img/fabrica.jpeg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover', // Ajusta el tamaño de la imagen para que cubra el div
            backgroundPosition: 'center' // Centra la imagen dentro del div
          }}></div>
        </div>
        <div className="w-10/12 lg:w-6/12 lg:min-h-80 flex flex-col justify-center gap-10 lg:gap-20">
          <h1 className="text-base lg:text-xl font-bold text-darkBlue ">Equipo de Desarrollo: Centro de Servicios Financieros</h1>
          <p className="w-10/12 lg:w-8/12 text-xs lg:text-lg text-darkBlue font-medium">Nuestro equipo de desarrollo es el núcleo dinámico y altamente especializado que impulsa la innovación y la excelencia en el ámbito de los servicios financieros. En nuestra fábrica de software, nos dedicamos exclusivamente a atender las necesidades tecnológicas de las instituciones financieras, ofreciendo soluciones personalizadas y de vanguardia que optimizan sus procesos y mejoran su rendimiento.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-darkBlue text-white p-6 w-screen">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Columna 1 */}
            <div className="w-full md:w-1/3 p-4 text-center md:text-left">
              <p>Inicio</p>
              <p>Servicios</p>
              <p>Acerca de nosotros</p>
              <p>Contacto</p>
            </div>

            {/* Columna 2 */}
            <div className="w-full md:w-1/3 p-4 text-center">
              <div className="flex justify-center gap-10">
                <div><FaTwitter /></div>
                <div><FaTiktok /></div>
                <div><FaFacebook /></div>
              </div>
            </div>

            {/* Columna 3 */}
            <div className="w-full md:w-1/3 p-4 text-center md:text-right">
              <div>
                <h3 className="text-lg">Hermes</h3>
                <p className="text-sm">Transformando vidas, construyendo futuro.</p>
              </div>
            </div>
          </div>
          <hr />
          <p className="text-center">© 2024 Hermes. Todos los derechos reservados.</p>
        </div>
      </footer>

    </main>
  );
}