import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // output: 'export', // Comentado para permitir next start
  // trailingSlash: true, // Solo necesario para exportación estática
  // images: {
  //   unoptimized: true, // Solo necesario para exportación estática
  // },
  // Configuración de puerto por defecto
  env: {
    PORT: process.env.PORT || '3001',
  },
};

export default nextConfig;