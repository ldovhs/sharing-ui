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
            <div className={s.app}>
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
            </div>
        </>
    );
}

export default zedClaimShell;
