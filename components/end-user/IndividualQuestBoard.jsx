import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";

const IndividualQuestBoard = ({
    session,
    isFetchingUserQuests,
    data,
    queryError,
    onSubmit,
    isSubmitting,
    submittedQuest,
}) => {
    const [currentQuests, setCurrentQuests] = useState(data);
    const { web3Error, SignOut } = useContext(Web3Context);

    useEffect(async () => {
        setCurrentQuests(data);
    }, [data]);

    const DoQuest = async (quest) => {
        const { questId, type, quantity, rewardTypeId, extendedQuestData } = quest;

        if (type === Enums.ANOMURA_SUBMISSION_QUEST) {
            let submission = {
                questId,
                wallet: session.user.address,
                type,
                rewardTypeId,
                quantity,
                extendedQuestData,
            };
            let updatedQuestArr = await onSubmit(submission, currentQuests);
            console.log(updatedQuestArr);
            setCurrentQuests(updatedQuestArr);
        } else {
            alert("Sorry I dont have it yet :)");
        }
    };

    return (
        <div className={s.boardQuest}>
            <div className={s.boardQuest_container}>
                <div className={s.boardQuest_wrapper}>
                    <div className={s.boardQuest_title}>Individual Quests</div>

                    <div className={s.boardQuest_scrollableArea}>
                        {/*  Render error message */}
                        {currentQuests?.isError && <div>{currentQuests?.message}</div>}

                        {/* Is Loading */}
                        {(isFetchingUserQuests || isSubmitting) && <div>Doing Octopus work!!!</div>}

                        {/*  Render individual quest board */}
                        {!isFetchingUserQuests &&
                            !isSubmitting &&
                            !currentQuests?.isError &&
                            currentQuests?.length > 0 &&
                            currentQuests?.map((item, index, row) => {
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

                                return (
                                    <React.Fragment key={index}>
                                        <div className={s.boardQuest_list_container}>
                                            <div className={s.boardQuest_list_content}>
                                                <div>
                                                    {text}

                                                    {type === Enums.FOLLOW_TWITTER && (
                                                        <span className="text-green-500">
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

                    {/*  Render board footer */}
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
};

const firstHOC = withUserQuestSubmit(IndividualQuestBoard);
export default withUserQuestQuery(firstHOC);
