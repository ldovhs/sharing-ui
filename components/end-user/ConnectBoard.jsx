import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import Enums from "enums";

const util = require("util");

export const CONNECT_WALLET = 0;
export const WALLET_AUTH = 1;
export const AUTHENTICATING = 2;

export default function ConnectBoard() {
    const [error, setError] = useState(null);
    const { web3Error, TryConnectAsUser, SignOut } = useContext(Web3Context);
    const [currentPrompt, setPrompt] = useState(CONNECT_WALLET);
    const connectWalletRef = React.createRef();
    const authWalletRef = React.createRef();
    const [animation, setAnimation] = useState("open");

    const changeView = async (viewState) => {
        if (viewState === WALLET_AUTH) {
             connectWalletRef.current?.className = `${s.close}`;
        }
        await new Promise((r) => setTimeout(r, 1800));
        setPrompt(viewState);
    };

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {web3Error && (
                            <>{web3Error}</>
                        )}
                        {currentPrompt === CONNECT_WALLET && !web3Error && (
                            <div ref={connectWalletRef}>
                                <img
                                    className={s.board_title}
                                    src="/img/sharing-ui/invite/anomura_big.png"
                                    alt="sign"
                                />
                                <img
                                    className={s.board_welcome}
                                    src="/img/sharing-ui/invite/welcome.png"
                                    alt="welcome"
                                />
                                <button
                                    className={s.board_orangeBtn}
                                    onClick={() => changeView(WALLET_AUTH)}
                                >
                                    Connect To Continue
                                </button>
                            </div>
                        )}
                        {currentPrompt === WALLET_AUTH && !web3Error && (
                            <div className={`${s.open}`} ref={authWalletRef}>
                                <div
                                    className={s.board_web3}
                                    onClick={() => {
                                        TryConnectAsUser(Enums.METAMASK);
                                    }}
                                >
                                    <button className={s.board_orangeBtn}>Connect Metamask</button>
                                </div>
                                <div
                                    className={s.board_web3}
                                    onClick={() => {
                                        TryConnectAsUser(Enums.WALLETCONNECT);
                                    }}
                                >
                                    <button
                                        className={s.board_tealBtn}
                                        onClick={() => setPrompt(WALLET_AUTH)}
                                    >
                                        Scan Wallet Connect
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
