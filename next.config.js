/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amzn-s3-swm-public-uploads-bucket.s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
