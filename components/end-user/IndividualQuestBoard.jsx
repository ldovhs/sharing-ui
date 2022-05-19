import React, { useEffect, useState, useContext, useRef } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";

import { withUserRewardQuery } from "@shared/HOC/reward";
import { useRouter } from "next/router";

const IndividualQuestBoard = ({
    session,
    isFetchingUserQuests,
    isFetchingUser,
    isFetchingUserRewards,
    userQuests,
    userRewards,
    queryError,
    onSubmit,
    isSubmitting,
    submittedQuest,
}) => {
    const [currentQuests, setCurrentQuests] = useState(userQuests);
    const [rewardAmount, setRewardAmount] = useState(null);
    const [scroll, setScroll] = useState({
        canScrollUp: false,
        canScrollDown: true,
    });
    const { web3Error, SignOut } = useContext(Web3Context);
    const scrollRef = useRef();
    let router = useRouter();

    //console.log(userQuests);
    //const test = true;
    useEffect(async () => {
        handleRenderUserQuest();
    }, [userQuests]);

    useEffect(async () => {
        if (userRewards) {
            let shellReward = userRewards.find(
                (r) =>
                    r.rewardType.reward.match("hell") ||
                    r.rewardType.reward.match("$Shell") ||
                    r.rewardType.reward.match("$SHELL")
            );
            if (shellReward?.quantity && shellReward.quantity > 0)
                setRewardAmount(shellReward.quantity);
        }
    }, [userRewards]);

    const handleRenderUserQuest = async () => {
        if (userQuests && userQuests.length > 0) {
            let twitterAuthQuest = userQuests.find((q) => q.type.name === Enums.TWITTER_AUTH);
            // check if user has authenticated twitter, to show twitter related quests
            userQuests = userQuests.filter((q) => {
                if (
                    !twitterAuthQuest.isDone &&
                    (q.type.name === Enums.TWITTER_RETWEET || q.type.name === Enums.FOLLOW_TWITTER)
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
        console.log(process.env.NODE_ENV);
        if (type.name === Enums.ZED_CLAIM) {
            // if (process.env.NODE_ENV === "production") {
            //     return window.open(`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/zed`);
            // } else {
            //     return router.push("/zed");
            // }
            return router.push("/zed");
        }
        if (type.name === Enums.NOODS_CLAIM) {
            // if (process.env.NODE_ENV === "production") {
            //     return window.open(`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/humanpark`);
            // } else {
            //     return router.push("/humanpark");
            // }
            return router.push("/humanpark");
        }

        // sub directory quest, should RETURN
        if (type.name === Enums.COLLABORATION_FREE_SHELL) {
            console.log(extendedQuestData);

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
            window.open("https://discord.com/invite/anomuragame", "_blank");
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

        // let submission = {
        //     questId,
        //     type,
        //     rewardTypeId,
        //     quantity,
        //     extendedQuestData,
        // };
        // let updatedQuestArr = await onSubmit(submission, currentQuests);

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
        return <span>{text}</span>;
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

                        <div
                            className={s.boardLarge_scrollableArea}
                            ref={scrollRef}
                            onScroll={onScroll}
                        >
                            {/* Is Loading */}
                            {(isFetchingUserQuests ||
                                isSubmitting ||
                                isFetchingUser ||
                                isFetchingUserRewards) && (
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
                                !isFetchingUser &&
                                !isFetchingUserRewards &&
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
const secondHOC = withUserRewardQuery(firstHOC);
export default withUserQuestQuery(secondHOC);
