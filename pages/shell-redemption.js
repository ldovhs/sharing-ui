import Head from "next/head";
import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
// import { unstable_getServerSession } from "next-auth/next"
// import { authOptions } from 'pages/api/auth/[...nextauth]'
import { ConnectBoard, ShellRedeem } from "@components/end-user";
import ShellRedeemConnectBoard from "@components/end-user/ShellRedeemConnectBoard";

function ShellRedemtion() {
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();
    const { web3Error } = useContext(Web3Context);

    useEffect(() => {
        if (web3Error) {
            setError(web3Error);
        }
    }, [web3Error]);

    useEffect(async () => {

    }, [session]);
    return (
        <>
            <Head>
                <title>Anomura | $SHELL Redemption Event</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Anomura | $SHELL Redemption Event" />
                <meta
                    property="og:description"
                    content="Spend your $SHELL on a chance to win shiny treasures like a mintlist spot, crab swag and NFTs!"
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/Shell_Redemption_Preview.png"
                />
                <meta
                    property="og:site_name"
                    content="Anomura | $SHELL Redemption Event"
                ></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/Shell_Redemption_Preview.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.redemption}>
                {!session ? <ShellRedeemConnectBoard /> : <ShellRedeem session={session} />}
                {/* <ShellRedeem session={session} /> */}
            </div>
        </>
    );
}

export default ShellRedemtion

// export async function getServerSideProps(context) {
//     // const session = await unstable_getServerSession(
//     //     context.req,
//     //     context.res,
//     //     authOptions
//     // );

//     const session = await getSession(
//         context
//     );

//     return {
//         props: {
//             session,
//         },
//     }
// }