import React, { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";
import "../sass/admin/adminBootstrap.css";

function MyApp({ Component, pageProps }) {
    return (
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
    );
}

export default MyApp;
