/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ add this
  images: {
    unoptimized: true, // ✅ needed for `next export`
    domains: ['*']
  },
  sassOptions: {
    includePaths: ['./src'],
  },
  transpilePackages: [
    'react-bootstrap-table-next',
    'react-bootstrap-table2-toolkit',
    'react-bootstrap-table2-paginator'
  ],
}

export default nextConfig
