import React from "react";
import s from "/sass/claim/claim.module.css";
import { useSession } from "next-auth/react";
import { ConnectBoard } from "@components/end-user";
import Enums from "enums";
import ClaimShellForOwningNFT from "@components/end-user/ClaimShellForOwningNFT";

function zedClaimShell() {
    const { data: session, status } = useSession({ required: false });

    return (
        <>
            <Head>
                <title>DeepSea Challenger Collaboration</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="DeepSea Challenger Collaboration" />
                <meta property="og:description" content="Collaboration Test" />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/ColorMonster.png"
                />
                <meta property="og:site_name" content="Anomura x ColorMonster"></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/ColorMonster.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.app}>
                {/* {!session ? (
                    <ConnectBoard />
                ) : (
                    <ClaimShellForOwningNFT
                        session={session}
                        claimType={Enums.ZED_CLAIM}
                        chain={"polygon"}
                        NftSymbol={"ZED"}
                    />
                )} */}
                <ConnectBoard />
            </div>
        </>
    );
}

export default zedClaimShell;
