/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['*'],
  },
  sassOptions: {
    includePaths: ['./src'],
  },
  transpilePackages: [
    'react-bootstrap-table-next',
    'react-bootstrap-table2-toolkit',
    'react-bootstrap-table2-paginator',
  ]
}

export default nextConfig
