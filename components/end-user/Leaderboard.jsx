import React, { useEffect, useState, useContext, useRef } from "react";
import Enums from "enums";
import s from "/sass/claim/claim.module.css";

export default function Leaderboard({ questData }) {
    const [questsRanking, setQuestRanking] = useState([]);
    useEffect(async () => {
        if (questData?.userQuests.length > 0) {
            let questsNotRanked = [...questData.userQuests];
            questsNotRanked.sort(sortOnReactionCountAndCreateDateFirst);
            setQuestRanking(questsNotRanked);
        }
    }, [questData]);
    console.log(questData);
    const sortOnReactionCountAndCreateDateFirst = (a, b) => {
        if (
            a.extendedUserQuestData.messageReactions.count ===
            b.extendedUserQuestData.messageReactions.count
        ) {
            console.log(a.createdAt);
            console.log(b.createdAt);
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            console.log(a.extendedUserQuestData.messageReactions.count);
            console.log(b.extendedUserQuestData.messageReactions.count);
            return (
                b.extendedUserQuestData.messageReactions.count -
                a.extendedUserQuestData.messageReactions.count
            );
        }
    };

    return (
        <div className={s.boardQuest}>
            <div className={s.boardQuest_container}>
                <div className={s.boardQuest_wrapper}>
                    {/* {questData && !questData.isError && ( */}
                    <>
                        <div className={s.boardQuest_title}>{questData?.type || "Quest Page"}</div>
                        {questData &&
                            !questData.isError &&
                            questData?.type === Enums.ANOMURA_SUBMISSION_QUEST && (
                                <div className="flex justify-content-between">
                                    <div className=" text-yellow-500">User</div>
                                    <div className="  text-green-500">Reactions</div>
                                </div>
                            )}
                    </>
                    {/* )} */}
                    <div className={s.boardQuest_scrollableArea}>
                        {!questData ||
                            (!questData?.userQuests && (
                                <div className="text-center">Not a valid quest page.</div>
                            ))}
                        {questData &&
                            // questData?.userQuests?.map((item, index, row) => {
                            questsRanking.map((item, index, row) => {
                                const {
                                    wallet,
                                    questId,
                                    user,
                                    extendedUserQuestData: { messageReactions },
                                } = item;
                                console.log(user);
                                return (
                                    <React.Fragment key={index}>
                                        <div className={s.boardQuest_list_containerRanking}>
                                            <div className={s.boardQuest_list_content}>
                                                <div>
                                                    {index + 1}.{" "}
                                                    {user.discordUserDiscriminator.trim().length > 0
                                                        ? user.discordUserDiscriminator
                                                        : user.wallet}
                                                </div>
                                                {/* <div>place holder</div> */}
                                            </div>
                                            <div className={s.boardQuest_list_result}>
                                                {messageReactions.count}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
