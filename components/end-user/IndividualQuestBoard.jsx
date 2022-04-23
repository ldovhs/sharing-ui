import React, { useEffect, useState, useContext, useRef } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";
import { withUserRewardQuery } from "@shared/HOC/reward";
import { withCurrentUserQuery } from "@shared/HOC/user";

const IndividualQuestBoard = ({
    session,
    isFetchingUserQuests,
    isFetchingUserRewards,
    isFetchingUser,
    userQuests,
    userRewards,
    currentUser,
    queryError,
    onSubmit,
    isSubmitting,
    submittedQuest,
}) => {
    const [currentQuests, setCurrentQuests] = useState(userQuests);
    const [rewardAmount, setRewardAmount] = useState(null);
    const { web3Error, SignOut } = useContext(Web3Context);
    const scrollRef = useRef();

    useEffect(async () => {
        if (userQuests && userQuests.length > 0 && userRewards) {
            userQuests.sort(isNotDoneFirst);
            let sum = userRewards
                .map((r) => {
                    if (r.rewardType.reward === "Shell" || r.rewardType.reward === "$hell") {
                        return r.quantity;
                    } else {
                        return 0;
                    }
                })
                .reduce((prev, curr) => prev + curr, 0);
            setRewardAmount(sum);
            setCurrentQuests(userQuests);
        }
    }, [userQuests]);

    const onScrollDown = () => {
        const offsetBottom = scrollRef.current.offsetTop + scrollRef.current.offsetHeight;
        scrollRef.current.scrollTo({ top: offsetBottom, behavior: "smooth" });
    };
    const onScrollUp = () => {
        const offsetBottom = scrollRef.current.offsetTop - scrollRef.current.offsetHeight;

        // console.log(scrollRef.current.offsetTop);
        // console.log(scrollRef.current.offsetHeight);
        // console.log(offsetBottom);

        scrollRef.current.scrollTo({ top: offsetBottom, behavior: "smooth" });
    };

    const DoQuest = async (quest) => {
        const { questId, type, quantity, rewardTypeId, extendedQuestData } = quest;
        if (type.name === Enums.DISCORD_AUTH) {
            window.open(getDiscordAuthLink(), "_blank");
        }

        if (type.name === Enums.TWITTER_AUTH) {
            window.open(getTwitterAuthLink(), "_blank");
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

    return (
        <div className={s.boardLarge}>
            <div className={s.boardLarge_container}>
                <div className={s.boardLarge_dollar}>
                    <div className={s.boardLarge_dollar_content}>
                        {rewardAmount !== null && rewardAmount !== 0 ? `$${rewardAmount}` : "$$$"}
                    </div>
                </div>

                <div className={s.boardLarge_wrapper}>
                    <div className={s.boardLarge_content}>
                        <div className={s.boardLarge_title}>
                            {currentUser !== null &&
                            currentUser?.discordUserDiscriminator !== null &&
                            currentUser?.discordUserDiscriminator?.length > 0
                                ? currentUser?.discordUserDiscriminator
                                : "Individual"}{" "}
                            Quests
                        </div>

                        {/*  Render error message */}
                        {currentQuests?.isError && <div>{currentQuests?.message}</div>}

                        <div className={s.boardLarge_scrollableArea} ref={scrollRef}>
                            {/* Is Loading */}
                            {(isFetchingUserQuests ||
                                isSubmitting ||
                                isFetchingUserRewards ||
                                isFetchingUser) && (
                                <div className={s.boardLarge_loading}>
                                    <div className={s.boardLarge_loading_wrapper}>
                                        <img
                                            src="/img/sharing-ui/clamsparkle.gif"
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
                                !isFetchingUserRewards & !isFetchingUser &&
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
                                                    {text}

                                                    {type.name === Enums.FOLLOW_TWITTER && (
                                                        <span className="text-teal-500">
                                                            {` @${extendedQuestData.followAccount}`}{" "}
                                                        </span>
                                                    )}
                                                    {type.name === Enums.FOLLOW_INSTAGRAM && (
                                                        <span className="text-red-400">
                                                            {` @${extendedQuestData.followAccount}`}{" "}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* <div className={s.boardLarge_list_reward}>
                                                    <div>+{quantity} </div>
                                                    <div>{rewardType.reward}</div>
                                                </div> */}
                                                <div className={s.boardLarge_list_action}>
                                                    <button
                                                        className={s.boardLarge_list_button}
                                                        onClick={() => DoQuest(item)}
                                                    >
                                                        <img
                                                            src={
                                                                "/img/sharing-ui/invite/quest button_bg.png"
                                                            }
                                                            alt="connectToContinue"
                                                        />
                                                        <div>
                                                            {/* <span>{isDone ? "DONE" : "GO"}</span> */}
                                                            <span>{quantity}</span>

                                                            <img
                                                                src={
                                                                    "/img/sharing-ui/invite/shellicon.png"
                                                                }
                                                                alt="reward icon"
                                                            />
                                                        </div>
                                                    </button>
                                                </div>
                                                {/* {isDone && <div>Completed</div>} */}
                                                {/* <div className={s.boardLarge_list_result}>
                                                    {!isDone && (
                                                        <>
                                                            {type.name === Enums.DISCORD_AUTH && (
                                                                <a
                                                                    className={s.boardLarge_pinkBtn}
                                                                    href={getDiscordAuthLink()}
                                                                    target="_blank"
                                                                    disabled={isDone}
                                                                >
                                                                    Auth
                                                                </a>
                                                            )}
                                                            {type.name === Enums.TWITTER_AUTH && (
                                                                <a
                                                                    className={s.boardLarge_pinkBtn}
                                                                    href={getTwitterAuthLink()}
                                                                    target="_blank"
                                                                    disabled={isDone}
                                                                >
                                                                    Auth
                                                                </a>
                                                            )}
                                                            {(type.name === Enums.FOLLOW_TWITTER ||
                                                                type.name ===
                                                                    Enums.FOLLOW_INSTAGRAM) && (
                                                                <button
                                                                    className={s.boardLarge_pinkBtn}
                                                                    onClick={() => DoQuest(item)}
                                                                    disabled={isDone}
                                                                >
                                                                    Follow
                                                                </button>
                                                            )}
                                                            {type.name ===
                                                                Enums.TWITTER_RETWEET && (
                                                                <button
                                                                    className={s.boardLarge_pinkBtn}
                                                                    onClick={() => DoQuest(item)}
                                                                    disabled={isDone}
                                                                >
                                                                    Retweet
                                                                </button>
                                                            )}
                                                            {type.name ===
                                                                Enums.ANOMURA_SUBMISSION_QUEST && (
                                                                <button
                                                                    className={s.boardLarge_pinkBtn}
                                                                    onClick={() => DoQuest(item)}
                                                                    disabled={isDone}
                                                                >
                                                                    Do
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    {isDone && (
                                                        <span className={s.boardLarge_yellowText}>
                                                            +{quantity} {rewardType.reward}
                                                        </span>
                                                    )}
                                                </div> */}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                        </div>

                        {/*  Render board footer arrows */}
                        <div className={s.boardLarge_footer}>
                            <button className={s.boardLarge_arrow} onClick={onScrollDown} />
                            <button className={s.boardLarge_arrow} onClick={onScrollUp} />
                        </div>
                    </div>
                </div>

                <div className={s.boardLarge_disconnect}>
                    {!isFetchingUserQuests && !isFetchingUser && (
                        <button onClick={() => SignOut()}>Disconnect</button>
                    )}
                </div>
            </div>
            {/* <div className={s.boardLarge_disconnect}>
                {!isFetchingUserQuests && !isFetchingUser && (
                    <button onClick={() => SignOut()}>Disconnect</button>
                )}
            </div> */}
        </div>
    );
};

const getDiscordAuthLink = () => {
    return `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_HOST}%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify`;
};

const getTwitterAuthLink = () => {
    return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_HOST}/api/auth/twitter/redirect&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
};

function isNotDoneFirst(a, b) {
    return Number(a.isDone) - Number(b.isDone);
}

const firstHOC = withUserQuestSubmit(IndividualQuestBoard);
const secondHOC = withUserQuestQuery(firstHOC);
const thirdHOC = withCurrentUserQuery(secondHOC);
export default withUserRewardQuery(thirdHOC);
