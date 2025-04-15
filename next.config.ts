import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: 
    [new URL('https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png')],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
