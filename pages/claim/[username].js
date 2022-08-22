import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
import { ConnectBoard, UserClaimReward } from "@components/end-user";

const util = require("util");

function claimReward() {
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
            <div className={s.app}>
                {!session ? <ConnectBoard /> : !process.env.NEXT_PUBLIC_ENABLE_CHALLENGER ?
                    <NotEnabledChallenger /> : <UserClaimReward session={session} />}
            </div>
        </>
    );
}

export default claimReward;
