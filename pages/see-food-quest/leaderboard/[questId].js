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
    const [questData, setQuestData] = useState(null);

    useEffect(async () => {
        if (!router.isReady || !questId) return;

        const res = await axios
            .get(`${Enums.BASEPATH}/api/user/quest/leaderboard`, {
                params: {
                    questId,
                },
            })
            .then((r) => r.data);
        if (res && res.hasOwnProperty("userQuests")) {
            console.log(res);
            setQuestData(res);
        }
    }, [router]);

    // console.log(questData);
    return (
        <>
            <div className={s.app}>{questData && <Leaderboard questData={questData} />}</div>
        </>
    );
}

export default QuestLeaderBoard;
