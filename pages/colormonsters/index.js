import React from "react";
import Head from "next/head";
import s from "/sass/claim/claim.module.css";
import { useSession } from "next-auth/react";
import { CollaborationQuestBoard, ConnectBoard } from "@components/end-user";
import Enums from "enums";
import CollaborationClaimShell from "@components/end-user/CollaborationClaimShell";

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
                    content="https://sharing-ui-staging.vercel.app/challenger/ColorMonster.png"
                />
                <meta property="og:site_name" content="Anomura x ColorMonster"></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://sharing-ui-staging.vercel.app/challenger/ColorMonster.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.app}>
                {!session ? (
                    <ConnectBoard />
                ) : (
                    <CollaborationQuestBoard session={session} collaboration={"colormonsters"} />
                )}
            </div>
        </>
    );
}

export default zedClaimShell;
