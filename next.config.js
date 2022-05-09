const { NEXT_PUBLIC_WEBSITE_HOST } = process.env;
const basePath = "/challenger";
module.exports = {
    assetPrefix: basePath,
    basePath: basePath,
    images: {
        domains: [NEXT_PUBLIC_WEBSITE_HOST],
        path: `${basePath}/_next/image`,
    },
    publicRuntimeConfig: {
        basePath: basePath,
    },
    webpack: (config) => {
        config.experiments = config.experiments || {};
        config.experiments.topLevelAwait = true;
        return config;
    },
    swcMinify: true,
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname,
    },
    // async redirects() {
    //     return [
    //         {
    //             source: "/api/auth/:path*",
    //             destination: "/api/auth/:path*",
    //             permanent: false,
    //         },
    //     ];
    // },
    // async headers() {
    //     return [
    //         {
    //             // matching all API routes
    //             source: "/api/:path*",
    //             headers: [
    //                 { key: "Access-Control-Allow-Credentials", value: "true" },
    //                 { key: "Access-Control-Allow-Origin", value: "https://sharing-ui.vercel.app/" },
    //                 {
    //                     key: "Access-Control-Allow-Methods",
    //                     value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    //                 },
    //                 {
    //                     key: "Access-Control-Allow-Headers",
    //                     value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    //                 },
    //             ],
    //         },
    //     ];
    // },
};
