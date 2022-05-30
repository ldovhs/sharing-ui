const basePath = "/challenger";
module.exports = {
    basePath: "/challenger",
    assetPrefix: "/challenger/",
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },

    images: {
        domains: [process.env.NEXT_PUBLIC_WEBSITE_HOST],
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
    async redirects() {
        return [
            {
                // do not include basePath in redirect here
                source: "/colormonster",
                destination: "/colormonsters",
                permanent: false,
            },
            {
                source: "/voidrunner",
                destination: "/voidrunners",
                permanent: false,
            },
        ];
    },
};
