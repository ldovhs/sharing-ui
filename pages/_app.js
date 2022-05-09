import React, { StrictMode } from "react";
import "../styles/globals.css";
import "../sass/admin/adminBootstrap.css";
import { Web3Provider } from "@context/Web3Context";
import { SessionProvider } from "next-auth/react";
import { AdminGuard } from "containers/admin/AdminGuard";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Enums from "enums";

const queryClient = new QueryClient();
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session} basePath={`${Enums.BASEPATH}/api/auth`}>
            <Web3Provider>
                <QueryClientProvider client={queryClient}>
                    <StrictMode>
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
