import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
import { ConnectBoard, UserClaimReward } from "@components/end-user/ComponentIndex";

const util = require("util");

function claimReward() {
    const [error, setError] = useState(null);

    const { data: session, status } = useSession({ required: false });
    const { web3Error, SignOut } = useContext(Web3Context);
    const isAuthenticating = status === "loading";

    useEffect(() => {
        if (web3Error) {
            console.log(web3Error);
            setError(web3Error);
        }
    }, [web3Error]);

    useEffect(async () => {}, [session]);

    return (
        <>
            <div className={s.app}>
                {!session ? <ConnectBoard /> : <UserClaimReward session={session} />}
                <div className={s.foreground} />
            </div>
        </>
    );
}

export default claimReward;
