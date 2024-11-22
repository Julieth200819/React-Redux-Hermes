/** @type {import('next').NextConfig} */
const nextConfig = { 
  serverExternalPackages: ['react-icons'],
  images: {
  remotePatterns: [
    {
      protocol: 'https', // Puedes usar '*' si deseas permitir cualquier protocolo
      hostname: '**',    // Usar '**' permite cualquier dominio
    },
  ],
},
    experimental: {
      optimizePackageImports: ['icon-library'],
      analyzeBrowserBundle: true, // Habilita el análisis del bundle del navegador
    },
  };
  
  export default nextConfig;
  
  