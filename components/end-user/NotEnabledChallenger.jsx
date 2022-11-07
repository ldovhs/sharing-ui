import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { BoardSmallDollarSign } from ".";

const NotEnabledChallenger = ({ session }) => {
    const { SignOut } = useContext(Web3Context);
    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        <>
                            <div className={s.board_goneFishTitle}>CLOSED - GONE FISHIN'</div>
                            <div className={s.board_goneFishText}>
                                The DeepSea Challenger has been paused.
                            </div>
                            <div className={s.board_goneFishText}>
                                Check back on <span>August 29-30</span> to spend your $SHELL on a
                                chance to win shiny treasures!
                            </div>
                            <button
                                className={s.board_pinkBtn}
                                onClick={() => {
                                    window.open(
                                        `https://www.anomuragame.com/challenger/shell-redemption`
                                    );
                                }}
                            >
                                <img
                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                    alt="connectToContinue"
                                />
                                <div>
                                    <span>LET’S GO</span>
                                </div>
                            </button>
                        </>
                    </div>
                </div>
            </div>
            {/*  Disconnect */}
            <button className={s.board_disconnect} onClick={() => SignOut()}>
                <img
                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Disconnect.png`}
                    alt="connectToContinue"
                />
                <div>
                    <span>Disconnect</span>
                </div>
            </button>
        </div>
    );
};

export default NotEnabledChallenger;
