/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    TOKEN: process.env.NEXT_PUBLIC_TOKEN,
  },
  images: {
    loader: "imgix",
    path: "https://noop/",
  },
}
