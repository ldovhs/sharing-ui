import React, { useEffect, useState, useContext, useRef } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";

const IndividualQuestBoard = ({
    session,
    isFetchingUserQuests,
    isFetchingUser,
    userQuests,
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
        if (userQuests && userQuests.length > 0) {
            userQuests.sort(isAlphabeticallly);
            userQuests.sort(isNotDoneFirst);
            let sum = userQuests
                .map((r) => {
                    if (r.rewardType.reward === "Shell" || r.rewardType.reward === "$hell") {
                        return r.rewardedQty;
                    } else {
                        return 0;
                    }
                })
                .reduce((prev, curr) => prev + curr, 0);
            setRewardAmount(sum);
            setCurrentQuests(userQuests);
        }
    }, [userQuests]);
    console.log(userQuests);
    const onScrollDown = () => {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollTop + scrollRef.current.offsetHeight + 12,
            behavior: "smooth",
        });
    };
    const onScrollUp = () => {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollTop - scrollRef.current.offsetHeight - 16,
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
        if (type.name === Enums.DISCORD_AUTH) {
            window.open(getDiscordAuthLink(), "_blank");
            return;
        }

        if (type.name === Enums.TWITTER_AUTH) {
            window.open(getTwitterAuthLink(), "_blank");
            return;
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
        if (type.name === Enums.FOLLOW_INSTAGRAM) {
            return (
                <span>
                    Follow
                    <span className="text-red-400">{` @${extendedQuestData.followAccount}`} </span>
                    on Instagram
                </span>
            );
        }
        if (
            type.name === Enums.FOLLOW_TWITTER &&
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
            type.name === Enums.FOLLOW_TWITTER &&
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
            type.name === Enums.DISCORD_AUTH ||
            type.name === Enums.TWITTER_AUTH ||
            type.name === Enums.TWITTER_RETWEET
        ) {
            return <span>{text}</span>;
        }
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

                        <div className={s.boardLarge_scrollableArea} ref={scrollRef}>
                            {/* Is Loading */}
                            {(isFetchingUserQuests || isSubmitting || isFetchingUser) && (
                                <div className={s.boardLarge_loading}>
                                    <div className={s.boardLarge_loading_wrapper}>
                                        <img
                                            src={`${Enums.BASEPATH}/img/sharing-ui/clamsparkle.gif`}
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
                                !isFetchingUser &&
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
                                                    {/* {text}
                                                    {type.name === Enums.FOLLOW_TWITTER && (
                                                        <span className="text-teal-500">
                                                            {` @${extendedQuestData.followAccount}`}{" "}
                                                        </span>
                                                    )}
                                                    {type.name === Enums.FOLLOW_INSTAGRAM && (
                                                        <>
                                                            <span className="text-red-400">
                                                                {` @${extendedQuestData.followAccount}`}{" "}
                                                            </span>
                                                        </>
                                                    )} */}
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
                            <button className={s.boardLarge_arrow} onClick={onScrollUp} />
                            <button className={s.boardLarge_arrow} onClick={onScrollDown} />
                        </div>
                    </div>
                </div>
            </div>
            {/*  Disconnect */}
            {!isFetchingUserQuests && !isFetchingUser && (
                <button className={s.boardLarge_disconnect} onClick={() => SignOut()}>
                    <img
                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Disconnect.png`}
                        alt="connectToContinue"
                    />
                    <div>
                        <span>Disconnect</span>
                    </div>
                </button>
            )}
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

const firstHOC = withUserQuestSubmit(IndividualQuestBoard);
export default withUserQuestQuery(firstHOC);
