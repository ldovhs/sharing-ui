import React, { useEffect, useState } from "react";
import s from "/sass/claim/claim.module.css";
import { useRouter } from "next/router";
import { Leaderboard } from "@components/end-user/ComponentIndex";
import axios from "axios";

const util = require("util");

function Unauthorized() {
    useEffect(async () => {}, []);
    return (
        <>
            <div className={s.app}>
                <div className={s.board}>
                    <div className={s.board_container}>
                        <div className={s.board_wrapper}>
                            <div className={s.board_content}>
                                <div className="flex justify-center content-center h1 text-red-400">
                                    Unauthorized access
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={s.foreground}></div>
            </div>
        </>
    );
}

export default Unauthorized;
