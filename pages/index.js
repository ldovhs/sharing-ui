import Head from "next/head";
import dynamic from "next/dynamic";
import { AdminLayout } from "/components/admin";
import React from "react";

function Admin() {
    return (
        <>
            <Head>
                <title>Anomura Challenger</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Anomura Challenger" />
                <meta property="og:description" content="Challenger Ahead!" />
                <meta
                    property="og:image"
                    content="https://sharing-ui.vercel.app/challenger/DeepSeaChallengerThumbnail_2.png"
                />
                <meta property="og:site_name" content="Anomura: The Cove Awaits You"></meta>
                <meta property="keywords" content="Anomura, NFT, Game" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://sharing-ui.vercel.app/challenger/DeepSeaChallengerThumbnail_2.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div>home page</div>
            {/* Css modules cant have a none pure style in 
             /  it like body so making a JSS style here 
             /  and applying it globally */}
            {/* <style>{`
                body {
                  overflow-x:hidden;
                  font-size: clamp(18px,2vw,28px);
                  font-family: Atlantis;
                  color: black;
                  line-height: 1.5;
                }
            `}</style> */}
        </>
    );
}

Admin.Layout = AdminLayout;
export default Admin;
