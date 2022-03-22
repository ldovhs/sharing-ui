import React, { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";
import "../sass/admin/adminBootstrap.css";
import { SiteProvider } from "@context/SiteContext";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <SiteProvider>
                <RecoilRoot>
                    <StrictMode>
                        {Component.Layout ? (
                            <Component.Layout>
                                <Component {...pageProps} />
                            </Component.Layout>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </StrictMode>
                </RecoilRoot>
            </SiteProvider>
        </SessionProvider>
    );
}

export default MyApp;
