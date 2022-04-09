import React, { useEffect, useState, useContext, useRef } from "react";
import Enums from "enums";
import s from "/sass/claim/claim.module.css";

export default function Leaderboard({ questData }) {
    const [questsRanking, setQuestRanking] = useState([]);
    useEffect(async () => {
        if (questData?.userQuests?.length > 0) {
            let questsNotRanked = [...questData.userQuests];
            questsNotRanked.sort(sortOnReactionCountAndCreateDateFirst);
            setQuestRanking(questsNotRanked);
        }
    }, [questData]);

    return (
        <div className={s.boardQuest}>
            <div className={s.boardQuest_container}>
                <div className={s.boardQuest_wrapper}>
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

                    <div className={s.boardQuest_scrollableArea}>
                        {!questData ||
                            (!questData?.userQuests && (
                                <div className="text-center">Not a valid quest page.</div>
                            ))}
                        {questData &&
                            questsRanking.map((item, index, row) => {
                                const {
                                    wallet,
                                    questId,
                                    user,
                                    extendedUserQuestData: { reaction },
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
                                            </div>
                                            <div className={s.boardQuest_list_result}>
                                                {reaction}
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

const sortOnReactionCountAndCreateDateFirst = (a, b) => {
    if (a.extendedUserQuestData.reaction === b.extendedUserQuestData.reaction) {
        return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
        return b.extendedUserQuestData.reaction - a.extendedUserQuestData.reaction;
    }
};
