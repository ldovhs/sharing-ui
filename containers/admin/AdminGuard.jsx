import React, { useEffect, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
const util = require("util");

export function AdminGuard({ children }) {
    const { data: session, status } = useSession({ required: false });
    const { web3Error } = useContext(Web3Context);

    useEffect(async () => {}, [session]);

    if (web3Error) {
        return (
            <div className="d-flex justify-content-center align-items-center fs-1 text-red-500">
                {web3Error}
            </div>
        );
    }

    if (session && session.user.isAdmin) {
        return <>{children}</>;
    }

    if (session && !session.user?.isAdmin) {
        return <>You are not admin.</>;
    }
    if (web3Error) {
        <div className="d-flex justify-content-center align-items-center fs-1 text-blue-500">
            {web3Error}
        </div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center fs-1 text-blue-500">
            PLEASE LOGIN {web3Error} {session}
        </div>
    );
}
