import React, { StrictMode, useEffect } from "react";
import "../styles/globals.css";
import "../sass/admin/adminBootstrap.css";
import { Web3Provider } from "@context/Web3Context";
import { SessionProvider } from "next-auth/react";
import { AdminGuard } from "containers/admin/AdminGuard";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Enums from "enums";
import Script from "next/script";
import * as gtag from "../lib/ga/gtag";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const router = useRouter();
    useEffect(() => {
        const handleRouteChange = (url) => {
            gtag.pageview(url);
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

    return (
        <SessionProvider session={session} basePath={`/challenger/api/auth`}>
            <Web3Provider>
                <QueryClientProvider client={queryClient}>
                    <StrictMode>
                        <Script
                            strategy="lazyOnload"
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                        />

                        <Script strategy="lazyOnload">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                                page_path: window.location.pathname,
                                });
                            `}
                        </Script>
                        {Component.requireAdmin ? (
                            <Component.Layout>
                                <AdminGuard>
                                    <Component {...pageProps} />
                                </AdminGuard>
                            </Component.Layout>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </StrictMode>
                </QueryClientProvider>
            </Web3Provider>
        </SessionProvider>
    );
}

export default MyApp;
