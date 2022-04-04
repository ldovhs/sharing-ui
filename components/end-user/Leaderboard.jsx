import React, { useEffect, useState, useContext, useRef } from "react";
import Enums from "enums";
import s from "/sass/claim/claim.module.css";

export default function Leaderboard({ questData }) {
    useEffect(async () => {
        console.log(questData);
    }, [questData]);

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
                            questData?.userQuests?.map((item, index, row) => {
                                const {
                                    wallet,
                                    questId,
                                    extendedUserQuestData: { messageReactions },
                                } = item;

                                return (
                                    <React.Fragment key={index}>
                                        <div className={s.boardQuest_list_container}>
                                            <div className={s.boardQuest_list_content}>
                                                <div>{wallet}</div>
                                                {/* <div>place holder</div> */}
                                            </div>
                                            <div className={s.boardQuest_list_result}>
                                                {/* <button
                                                    className={s.boardQuest_pinkBtn}
                                                    onClick={() => DoQuest(item)}
                                                >
                                                    Do
                                                </button> */}
                                                {messageReactions.count}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                    </div>
                    {/* <div className={s.boardQuest_footer}>
                        <span className={s.boardQuest_footer_line} />
                        <button className={s.boardQuest_yellowText} onClick={() => SignOut()}>
                            Disconnect
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
