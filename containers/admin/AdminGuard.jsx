import React, { useEffect, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
const util = require("util");

export function AdminGuard({ children }) {
    const { data: session, status } = useSession({ required: false });
    const { web3Error } = useContext(Web3Context);
    if (session) {
        console.log(util.inspect(session, { showHidden: false, depth: null, colors: true }));
    }

    useEffect(() => {
        ethereum = window.ethereum;
    }),
        [];

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

    return (
        <div className="d-flex justify-content-center align-items-center fs-1 text-blue-500">
            PLEASE LOGIN
        </div>
    );
}
