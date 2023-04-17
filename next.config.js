/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.myanimelist.net",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	env: {
		API_KEY: process.env.API_KEY,
		AUTH_DOMAIN: process.env.AUTH_DOMAIN,
		PROJECT_ID: process.env.PROJECT_ID,
		STORAGE_BUCKET: process.env.STORAGE_BUCKET,
		MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
		APP_ID: process.env.APP_ID,

		EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
		EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
		EMAILJS_KEY: process.env.EMAILJS_KEY,
	},
};

module.exports = nextConfig;
