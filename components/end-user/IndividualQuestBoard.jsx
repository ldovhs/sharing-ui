import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import axios from "axios";
import Enums from "enums";

export default function IndividualQuestBoard({ session }) {
    const router = useRouter();
    const [quests, setQuests] = useState([]);
    const [error, setError] = useState(null);
    const { web3Error, SignOut } = useContext(Web3Context);
    const { username } = router.query;

    useEffect(async () => {
        if (!router.isReady) return;
        console.log(username);
        const res = await axios.get("/api/user/quest", { params: { username } });
        console.log(res);
        if (res.data.isError) {
            setError(res.data.message);
        } else {
            setQuests(res.data);
        }
    }, [router.isReady]);

    // TODO user is logged in, we need to check if the wallet account matches our db

    const DoQuest = async (item) => {
        const {
            id,
            questId,
            type,
            description,
            text,
            completedText,
            isEnabled,
            isRequired,
            quantity,
            rewardTypeId,
            extendedQuestData,
        } = item;

        if (type === Enums.ANOMURA_SUBMISSION_QUEST) {
            let submission = {
                questId,
                wallet: session.user.address,
                type,
                rewardTypeId,
                quantity,
                extendedQuestData,
            };
            let submitQuest = await axios.post("/api/user/quest/submit", submission);

            if (submitQuest) {
                let updatedQuests = quests.map((q) => {
                    if (q.questId == questId) {
                        q.isDone = true;
                    } else {
                        q.isDone = false;
                    }
                    return q;
                });

                Promise.all(updatedQuests).then((updatedArr) => {
                    setQuests(updatedArr);
                });
            }
        } else {
            alert("Sorry I dont have it yet :)");
        }
    };
    return (
        <div className={s.boardQuest}>
            <div className={s.boardQuest_container}>
                <div className={s.boardQuest_wrapper}>
                    <div className={s.boardQuest_title}>Individual Quests</div>
                    {quests && !error && (
                        <div className={s.boardQuest_scrollableArea}>
                            {quests &&
                                quests.length > 0 &&
                                quests?.map((item, index, row) => {
                                    const {
                                        questId,
                                        type,
                                        description,
                                        text,
                                        completedText,
                                        isEnabled,
                                        isRequired,
                                        quantity,
                                        rewardTypeId,
                                        extendedQuestData,
                                        isDone,
                                        rewardType,
                                    } = item;

                                    console.log(item);
                                    return (
                                        <React.Fragment key={index}>
                                            <div className={s.boardQuest_list_container}>
                                                <div className={s.boardQuest_list_content}>
                                                    <div>
                                                        {text}

                                                        {type === Enums.FOLLOW_TWITTER && (
                                                            <span>
                                                                {` @${extendedQuestData.followAccount}`}{" "}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isDone && <div>Completed</div>}
                                                </div>
                                                <div className={s.boardQuest_list_result}>
                                                    {!isDone && (
                                                        <button
                                                            className={s.boardQuest_pinkBtn}
                                                            onClick={() => DoQuest(item)}
                                                            disabled={isDone}
                                                        >
                                                            Do
                                                        </button>
                                                    )}
                                                    {isDone && (
                                                        <span className={s.boardQuest_yellowText}>
                                                            +{quantity} {rewardType.reward}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                    )}
                    {error && <div className={s.boardQuest_scrollableArea}>{error}</div>}

                    <div className={s.boardQuest_footer}>
                        <span className={s.boardQuest_footer_line} />
                        <button className={s.boardQuest_yellowText} onClick={() => SignOut()}>
                            Disconnect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
