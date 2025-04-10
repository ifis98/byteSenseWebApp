/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src'],
  },
  // This setting allows the use of images from any domain
  images: {
    domains: ['*'],
  },
  // Add this transpiler configuration
  transpilePackages: [
    'react-bootstrap-table-next', 
    'react-bootstrap-table2-toolkit', 
    'react-bootstrap-table2-paginator'
  ]
};

export default nextConfig;