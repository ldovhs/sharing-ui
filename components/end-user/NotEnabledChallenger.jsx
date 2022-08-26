import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { BoardSmallDollarSign } from ".";

const NotEnabledChallenger = () => {
    const { SignOut, TryValidate } = useContext(Web3Context);
    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        <>
                            <div className={s.board_goneFishTitle}>CLOSED - GONE FISHIN</div>
                            <div className={s.board_goneFishText}>
                                The DeepSea Challenger has been paused. You can still connect to
                                view your $SHELL balance.
                            </div>
                            <div className={s.board_goneFishText}>
                                Check back on <span>August 29-30</span> for a chance to spend your
                                $SHELL on a chance to win shiny treasures!
                            </div>
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
