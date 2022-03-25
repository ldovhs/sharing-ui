import React, { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";
import "../sass/admin/adminBootstrap.css";
import { SiteProvider } from "@context/SiteContext";
import { Web3Provider } from "@context/Web3Context";
import { SessionProvider } from "next-auth/react";
import { AdminGuard } from "containers/admin/AdminGuard";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <SiteProvider>
                <Web3Provider>
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
                </Web3Provider>
            </SiteProvider>
        </SessionProvider>
    );
}

export default MyApp;
