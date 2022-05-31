import React from "react";
import Head from "next/head";
import s from "/sass/claim/claim.module.css";
import { useSession } from "next-auth/react";
import { CollaborationQuestBoard, ConnectBoard } from "@components/end-user";
import Enums from "enums";

function VoidRunners() {
    const { data: session, status } = useSession({ required: false });

    return (
        <>
            <Head>
                <title>DeepSea Challenger Collaboration</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Anomura x Void Runners" />
                <meta
                    property="og:description"
                    content="We’ve partnered with Void Runners! Complete quests, earn $SHELL, unlock prizes."
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/Void_Runners_preview.png"
                />
                <meta property="og:site_name" content="Anomura x Void Runners"></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/Void_Runners_preview.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.app}>
                {!session ? (
                    <ConnectBoard />
                ) : (
                    <CollaborationQuestBoard session={session} collaboration={"voidrunners"} />
                )}
            </div>
        </>
    );
}

export default VoidRunners;
