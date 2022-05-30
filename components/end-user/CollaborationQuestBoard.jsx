import React, { useEffect, useState, useRef } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";
import { useRouter } from "next/router";
import { useCurrentUserQuery } from "@shared/HOC";
import { BoardLargeDollarSign } from ".";
import DisconnectButton from "./shared/DisconnectButton";

const CollaborationQuestBoard = ({
    session,
    isFetchingUserQuests,
    userQuests,
    onSubmit,
    isSubmitting,
    submittedQuest,
    collaboration,
}) => {
    const [currentUser, fetchingCurrentUser] = useCurrentUserQuery();
    const [currentQuests, setCurrentQuests] = useState(userQuests);
    const [scroll, setScroll] = useState({
        canScrollUp: false,
        canScrollDown: true,
    });
    const scrollRef = useRef();
    let router = useRouter();

    useEffect(async () => {
        handleRenderUserQuest();
    }, [userQuests]);

    const handleRenderUserQuest = async () => {
        if (userQuests && userQuests.length > 0) {
            let twitterAuthQuest = userQuests.find((q) => q.type.name === Enums.TWITTER_AUTH);

            userQuests = userQuests.filter((q) => {
                if (
                    !twitterAuthQuest.isDone &&
                    (q.type.name === Enums.TWITTER_RETWEET || q.type.name === Enums.FOLLOW_TWITTER)
                ) {
                    return false;
                }
                if (q.type.name === Enums.CODE_QUEST) {
                    return false;
                }
                if (
                    q.extendedQuestData.collaboration &&
                    q.extendedQuestData.collaboration.length > 0 &&
                    q.extendedQuestData.collaboration === collaboration
                ) {
                    // if (
                    //     // collaboration === "colormonsters" &&
                    //     q.type.name === Enums.LIMITED_FREE_SHELL
                    // ) {
                    //     /*check if user follow twitter and in color monster server discord
                    //     if yes we show the free shell 500$, else dont show this 500$
                    //     */

                    //     let hasTwitterId = false,
                    //         hasDiscordId = false,
                    //         hasFollowColorMonsterTwitter = false,
                    //         hasJoinColorMonsterDiscord = false;
                    //     if (currentUser?.twitterId !== null && currentUser?.twitterId.length > 1) {
                    //         hasTwitterId = true;
                    //     }
                    //     if (currentUser?.discordId !== null && currentUser?.discordId.length > 1) {
                    //         hasDiscordId = true;
                    //     }

                    //     let followColorMonsterTwitter = userQuests.find(
                    //         (q) =>
                    //             q.type.name === Enums.FOLLOW_TWITTER &&
                    //             q.extendedQuestData.collaboration &&
                    //             q.extendedQuestData.collaboration === collaboration
                    //     );
                    //     if (followColorMonsterTwitter.isDone === true) {
                    //         hasFollowColorMonsterTwitter = true;
                    //     }

                    //     let shareColorMonsterTweetArray = userQuests.filter(
                    //         (q) =>
                    //             q.type.name === Enums.TWITTER_RETWEET &&
                    //             q.extendedQuestData.collaboration &&
                    //             q.extendedQuestData.collaboration === collaboration
                    //     );
                    //     let isShare = true;
                    //     shareColorMonsterTweetArray.map((q) => {
                    //         if (q.isDone === false) {
                    //             isShare = false;
                    //         }
                    //     });
                    //     if (isShare) {
                    //         hasJoinColorMonsterDiscord = true;
                    //     }

                    //     if (
                    //         hasTwitterId &&
                    //         hasDiscordId &&
                    //         hasFollowColorMonsterTwitter &&
                    //         hasJoinColorMonsterDiscord
                    //     ) {
                    //         return true;
                    //     } else {
                    //         return false;
                    //     }
                    // }
                    return true;
                }
                if (
                    q.extendedQuestData.collaboration &&
                    q.extendedQuestData.collaboration.length > 0 &&
                    q.extendedQuestData.collaboration !== collaboration
                ) {
                    return false;
                }

                /* exclude daily free cell */
                if (
                    q.type.name === Enums.ZED_CLAIM ||
                    q.type.name === Enums.NOODS_CLAIM ||
                    q.type.name === Enums.DAILY_SHELL
                ) {
                    return false;
                }

                return true;
            });

            userQuests.sort(isAlphabeticallly);
            userQuests.sort(isNotDoneFirst);
            setCurrentQuests(userQuests);
            if (userQuests.length <= 3) {
                setScroll((prevState) => ({
                    ...prevState,
                    canScrollDown: false,
                    canScrollUp: false,
                }));
            } else {
                setScroll((prevState) => ({
                    ...prevState,
                    canScrollDown: true,
                    canScrollUp: false,
                }));
            }
        }
    };

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

    /*
     * @dev
     * if DISCORD_AUTH || TWITTER_AUTH, we do separated quest through redirect links
     * else submit a quest through api
     */
    const DoQuest = async (quest) => {
        const { questId, type, quantity, rewardTypeId, extendedQuestData } = quest;

        if (type.name === Enums.ZED_CLAIM) {
            return router.push("/zed");
        }
        if (type.name === Enums.NOODS_CLAIM) {
            return router.push("/humanpark");
        }

        // sub directory quest, should RETURN
        if (type.name === Enums.COLLABORATION_FREE_SHELL) {
            switch (extendedQuestData.collaboration) {
                case "colormonster":
                    return router.push("/colormonster");
                default:
                    return router.push("/");
            }
        }
        if (type.name === Enums.DISCORD_AUTH) {
            return window.open(getDiscordAuthLink(), "_blank");
        }

        if (type.name === Enums.TWITTER_AUTH) {
            return window.open(getTwitterAuthLink(), "_blank");
        }

        if (type.name === Enums.JOIN_DISCORD) {
            //window.open(`https://discord.com/invite/anomuragame`, "_blank");
            let discordServer = extendedQuestData.discordServer;
            window.open(`https://discord.com/invite/${discordServer}`, "_blank");
        }

        if (type.name === Enums.TWITTER_RETWEET) {
            window.open(
                `https://twitter.com/intent/retweet?tweet_id=${extendedQuestData.tweetId}`,
                "_blank"
            );
        }

        if (type.name === Enums.FOLLOW_TWITTER) {
            window.open(
                `https://twitter.com/intent/follow?screen_name=${extendedQuestData.followAccount}`,
                "_blank"
            );
        }
        if (type.name === Enums.FOLLOW_INSTAGRAM) {
            window.open(`https://www.instagram.com/${extendedQuestData.followAccount}`, "_blank");
        }

        let submission = {
            questId,
            type,
            rewardTypeId,
            quantity,
            extendedQuestData,
        };
        let updatedQuestArr = await onSubmit(submission, currentQuests);

        setCurrentQuests(updatedQuestArr);
    };

    const GetQuestText = (text, type, extendedQuestData) => {
        if (type?.name === Enums.FOLLOW_INSTAGRAM) {
            return (
                <span>
                    Follow
                    <span className="text-red-400">{` @${extendedQuestData.followAccount}`} </span>
                    on Instagram
                </span>
            );
        }
        if (
            type?.name === Enums.FOLLOW_TWITTER &&
            !extendedQuestData.followAccount.match(/Whale_Drop/)
        ) {
            return (
                <span>
                    Follow
                    <span className="text-teal-500">{` @${extendedQuestData.followAccount}`} </span>
                    on Twitter
                </span>
            );
        }
        if (
            type?.name === Enums.FOLLOW_TWITTER &&
            extendedQuestData.followAccount.match(/Whale_Drop/)
        ) {
            return (
                <span>
                    Follow our King Crab
                    <span className="text-teal-500">{` @${extendedQuestData.followAccount}`} </span>
                </span>
            );
        }
        if (
            type?.name === Enums.DISCORD_AUTH ||
            type?.name === Enums.TWITTER_AUTH ||
            type?.name === Enums.TWITTER_RETWEET
        ) {
            return <span>{text}</span>;
        }
        return <span>{text}</span>;
    };
    return (
        <div className={s.boardLarge}>
            <div className={s.boardLarge_container}>
                <BoardLargeDollarSign />

                <div className={s.boardLarge_wrapper}>
                    <div className={s.boardLarge_content}>
                        <div className={s.boardLarge_title}>
                            <div>Quests</div>

                            {session !== null && session?.provider === "discord" && (
                                <div>
                                    {session?.profile?.username +
                                        "#" +
                                        session?.profile?.discriminator}
                                </div>
                            )}
                            {session !== null && session?.provider === "twitter" && (
                                <div>{session?.profile?.data?.username}</div>
                            )}
                        </div>

                        {/*  Render error message */}
                        {currentQuests?.isError && <div>{currentQuests?.message}</div>}

                        <div
                            className={s.boardLarge_scrollableArea}
                            ref={scrollRef}
                            onScroll={onScroll}
                        >
                            {/* Is Loading */}
                            {(isFetchingUserQuests || isSubmitting || fetchingCurrentUser) && (
                                <div className={s.boardLarge_loading}>
                                    <div className={s.boardLarge_loading_wrapper}>
                                        <img
                                            src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                                            alt="Loading data"
                                        />
                                        <div className={s.boardLarge_loading_wrapper_text}>
                                            Fetching data{" "}
                                            <span
                                                className={
                                                    s.boardLarge_loading_wrapper_text_ellipsis
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*  Render individual quest board */}
                            {!isFetchingUserQuests &&
                                !isSubmitting &&
                                !fetchingCurrentUser &&
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
                                            <div className={s.boardLarge_list_container}>
                                                <div className={s.boardLarge_list_text}>
                                                    {GetQuestText(text, type, extendedQuestData)}
                                                </div>
                                                <div className={s.boardLarge_list_action}>
                                                    {isDone && (
                                                        <button
                                                            className={s.boardLarge_list_doneBtn}
                                                        >
                                                            <img
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Quest_Done Button.png`}
                                                                alt="connectToContinue"
                                                            />
                                                            <div>
                                                                <span>Done</span>
                                                            </div>
                                                        </button>
                                                    )}
                                                    {!isDone && (
                                                        <button
                                                            className={s.boardLarge_list_questBtn}
                                                            onClick={() => DoQuest(item)}
                                                        >
                                                            <img
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Quest_Reward Button.png`}
                                                                alt="reward button"
                                                            />
                                                            <div>
                                                                <span>{quantity}</span>
                                                                {rewardType.reward.match(
                                                                    "hell"
                                                                ) && (
                                                                    <img
                                                                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                                                        alt="reward icon"
                                                                    />
                                                                )}

                                                                {rewardType.reward.match(
                                                                    /bowl|Bowl/
                                                                ) && (
                                                                    <img
                                                                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                                                        alt="reward icon"
                                                                    />
                                                                )}
                                                            </div>
                                                        </button>
                                                    )}
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
            {/*  Disconnect */}
            {!isFetchingUserQuests && !fetchingCurrentUser && <DisconnectButton />}
        </div>
    );
};

const getDiscordAuthLink = () => {
    return `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_HOST}%2Fchallenger%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify`;
};

const getTwitterAuthLink = () => {
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_HOST}/challenger/api/auth/twitter/redirect&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
};

function isNotDoneFirst(a, b) {
    return Number(a.isDone) - Number(b.isDone);
}
function isAlphabeticallly(a, b) {
    return a.text.localeCompare(b.text);
}

const firstHOC = withUserQuestSubmit(CollaborationQuestBoard);
export default withUserQuestQuery(firstHOC);
