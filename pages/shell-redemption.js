import Head from "next/head";
import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
import { ConnectBoard, IndividualQuestBoard, ShellRedeem } from "@components/end-user";

const util = require("util");

// Home page for user
function Home() {
    const [error, setError] = useState(null);
    const { data: session, status } = useSession({ required: false });
    const { web3Error } = useContext(Web3Context);

    useEffect(() => {
        if (web3Error) {
            setError(web3Error);
        }
    }, [web3Error]);

    useEffect(async () => { }, [session]);
    return (
        <>
            <Head>
                <title>DeepSea Challenger Shell Redemption</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="DeepSea Challenger" />
                <meta
                    property="og:description"
                    content="Complete quests, earn $SHELL, unlock prizes"
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/DeepSeaChallengerThumbnail_2.png"
                />
                <meta
                    property="og:site_name"
                    content="Anomura: The Cove's DeepSea Challenger"
                ></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/DeepSeaChallengerThumbnail_2.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.redemption}>
                {!session ? <ConnectBoard /> : <ShellRedeem session={session} />}
            </div>
        </>
    );
}

export default Home;
