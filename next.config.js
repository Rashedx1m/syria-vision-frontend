const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "127.0.0.1", "res.cloudinary.com"],
  },
};

module.exports = withNextIntl(nextConfig);
