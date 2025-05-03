  /** @type {import('next').NextConfig} */
  const nextConfig = {
      images: {
        domains: ['your-domain.com','static-files.risein.com','hebbkx1anhila5yf.public.blob.vercel-storage.com','cdn-icons-png.flaticon.com','encrypted-tbn0.gstatic.com','play-lh.googleusercontent.com',"pbs.twimg.com"], // Replace with your actual image domain
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'your-domain.com',
            hostname: "images.unsplash.com",
            port: '',
            pathname: '/path-to-images/**',
          },
        ],
      },
    };
    
    export default nextConfig;
    