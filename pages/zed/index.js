import React from "react";
import s from "/sass/claim/claim.module.css";
import { ConnectBoard } from "@components/end-user";
import Enums from "enums";
import ClaimShellForOwningNFT from "@components/end-user/ClaimShellForOwningNFT";

function zedClaimShell({ session }) {

    // currently disabled
    return (
        <>
            {/* <div className={s.app}>
                {!session ? (
                    <ConnectBoard />
                ) : (
                    <ClaimShellForOwningNFT
                        session={session}
                        NFT={Enums.ZED_CLAIM}
                        chain={"polygon"}
                        NftSymbol={"ZED"}
                    />
                )}
            </div> */}
        </>
    );
}

export default zedClaimShell;

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    return {
        props: {
            session,
        },
    }
}
