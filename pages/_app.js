import React, { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";
import "../sass/admin/adminBootstrap.css";
import { Web3Provider } from "@context/Web3Context";
import { SessionProvider } from "next-auth/react";
import { AdminGuard } from "containers/admin/AdminGuard";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Web3Provider>
                <QueryClientProvider client={queryClient}>
                    <RecoilRoot>
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
                    </RecoilRoot>
                </QueryClientProvider>
            </Web3Provider>
        </SessionProvider>
    );
}

export default MyApp;
