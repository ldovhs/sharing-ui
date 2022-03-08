import Head from 'next/head';
import { TreasureChest, Footer, SkyArea, SnowArea, LavaArea, PondArea } from "/containers/anomura/ContainerIndex";
import s from "/sass/anomura/anomura.module.css";

export default function Anomura() {
    return (
        <div className={s.app}>
            <Head>
                <title>Anomura Landing</title>
                <meta name="description" content="Anomura the next NFT game to take the world by storm." />
                <meta name="author" content="Jonathan Westfall" />
                <meta name="keywords" content="Anomura, NFT, Game" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SkyArea />
            <SnowArea />
            <LavaArea />
            <PondArea />
            {/* Treasure Chest */}

            {/* Footer */}

            <style >{`
                body {
                font-family: Atlantis;
                font-size:36px;
                color:white;
                }`}
            </style>
        </div>

    )
}
