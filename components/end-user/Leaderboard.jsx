import React, { useEffect, useState, useRef } from "react";
import Enums from "enums";
import s from "/sass/claim/claim.module.css";
import { BoardLargeDollarSign } from ".";

export default function Leaderboard({ questData }) {
    const [questsRanking, setQuestRanking] = useState([]);
    // console.log(questData);
    useEffect(async () => {
        if (questData?.userQuests?.length > 0) {
            let questsNotRanked = [...questData.userQuests];
            questsNotRanked.sort(sortOnReactionCountAndCreateDateFirst);
            setQuestRanking(questsNotRanked);
        }
    }, [questData]);
    // console.log(questsRanking);
    const scrollRef = useRef();

    const onScroll = (e) => {
        if (
            e.target.scrollTop >=
            scrollRef.current.scrollHeight - scrollRef.current.offsetHeight - 16
        ) {
            setScroll((prevState) => ({ ...prevState, canScrollDown: false, canScrollUp: true }));
            return;
        }
        if (
            e.target.scrollTop <
                scrollRef.current.scrollHeight - scrollRef.current.offsetHeight - 16 &&
            e.target.scrollTop > 0
        ) {
            setScroll((prevState) => ({ ...prevState, canScrollDown: true, canScrollUp: true }));
            return;
        }

        if (e.target.scrollTop === 0) {
            setScroll((prevState) => ({ ...prevState, canScrollDown: true, canScrollUp: false }));
            return;
        }
    };
    const onScrollDown = () => {
        let scrollValue = scrollRef.current.scrollTop + scrollRef.current.offsetHeight + 12;
        scrollRef.current.scrollTo({
            top: scrollValue,
            behavior: "smooth",
        });
    };
    const onScrollUp = () => {
        let scrollValue = scrollRef.current.scrollTop - scrollRef.current.offsetHeight - 16;
        scrollRef.current.scrollTo({
            top: scrollValue,
            behavior: "smooth",
        });
    };
    return (
        <div className={s.boardLarge}>
            <div className={s.boardLarge_container}>
                <BoardLargeDollarSign />
                <div className={s.boardLarge_wrapper}>
                    <div className={s.boardLarge_content}>
                        <div className={s.boardLarge_title}> Submission Quest Ranking</div>
                        {questData &&
                            !questData.isError &&
                            questData?.type.name == Enums.IMAGE_UPLOAD_QUEST && (
                                <div className="flex justify-content-between w-full">
                                    <div className=" text-blue-700 ml-12">User</div>
                                    <div className="  text-blue-700">Reactions</div>
                                </div>
                            )}

                        <div
                            ref={scrollRef}
                            onScroll={onScroll}
                            className={s.boardLarge_scrollableArea}
                        >
                            {!questData ||
                                (!questData?.userQuests && (
                                    <div className="text-center">Not a valid quest page.</div>
                                ))}
                            {questsRanking &&
                                questsRanking.map((item, index, row) => {
                                    const {
                                        wallet,
                                        questId,
                                        user,
                                        extendedUserQuestData: { reaction },
                                    } = item;

                                    return (
                                        <React.Fragment key={index}>
                                            <div className={s.boardLarge_list_ranking_container}>
                                                <div
                                                    className={`${s.boardLarge_list_ranking_number}`}
                                                >
                                                    <img
                                                        className={`${s.boardLarge_list_ranking_number_img}`}
                                                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/Ranking_Number 1.png`}
                                                    />
                                                </div>
                                                <div className={s.boardLarge_list_ranking_text}>
                                                    <div>
                                                        {user.discordUserDiscriminator != null &&
                                                        user.discordUserDiscriminator.trim()
                                                            .length > 0
                                                            ? user.discordUserDiscriminator
                                                            : user.wallet}
                                                    </div>
                                                    <div>{reaction || 0}</div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                        {/*  Render board footer arrows */}
                        <div className={s.boardLarge_footer}>
                            <button className={s.boardLarge_arrow} onClick={onScrollUp}>
                                <img
                                    src={
                                        scroll.canScrollUp
                                            ? `${Enums.BASEPATH}/img/sharing-ui/invite/Arrow_Up_Blue.png`
                                            : `${Enums.BASEPATH}/img/sharing-ui/invite/arrow_up.png`
                                    }
                                    alt="scroll up"
                                />
                            </button>
                            <button className={s.boardLarge_arrow} onClick={onScrollDown}>
                                <img
                                    src={
                                        scroll.canScrollDown
                                            ? `${Enums.BASEPATH}/img/sharing-ui/invite/Arrow_Down_Blue.png`
                                            : `${Enums.BASEPATH}/img/sharing-ui/invite/arrow_down.png`
                                    }
                                    alt="scroll down"
                                />
                            </button>
                        </div>
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
