import React, { useEffect, useState } from "react";
import s from "/sass/claim/claim.module.css";
import { useRouter } from "next/router";
import { Leaderboard } from "@components/end-user";
import axios from "axios";
import Enums from "enums";

const util = require("util");

function QuestLeaderBoard() {
    const router = useRouter();
    const { questId } = router.query;
    const [questData, setQuestData] = useState();
    useEffect(async () => {
        if (!router.isReady || !questId) return;

        const res = await axios.get(`${Enums.BASEPATH}/api/user/quest/leaderboard`, {
            params: {
                questId,
            },
        });

        setQuestData(res.data);
    }, [router.isReady]);
    return (
        <>
            <div className={s.app}>
                <Leaderboard questData={questData} />
            </div>
        </>
    );
}

export default QuestLeaderBoard;
