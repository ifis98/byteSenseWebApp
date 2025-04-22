/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <== Required for Docker-based Cloud Run deploys

  sassOptions: {
    includePaths: ['./src'],
  },
  images: {
    domains: ['*'],
  },
  transpilePackages: [
    'react-bootstrap-table-next',
    'react-bootstrap-table2-toolkit',
    'react-bootstrap-table2-paginator'
  ]
};

export default nextConfig;
