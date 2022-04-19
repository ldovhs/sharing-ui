import React, { useEffect, useState, useContext } from "react";
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

    useEffect(async () => {
        if (userQuests && userRewards) {
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

    const DoQuest = async (quest) => {
        const { questId, type, quantity, rewardTypeId, extendedQuestData } = quest;

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
        <div className={s.boardQuest}>
            <div className={s.boardQuest_container}>
                <div className={s.boardQuest_dollar}>
                    <div className={s.boardQuest_dollar_content}>
                        {rewardAmount !== null && rewardAmount !== 0 ? `$${rewardAmount}` : "$$$"}
                    </div>
                </div>

                <div className={s.boardQuest_wrapper}>
                    <div className={s.boardQuest_title}>
                        {currentUser !== null &&
                        currentUser?.discordUserDiscriminator !== null &&
                        currentUser?.discordUserDiscriminator?.length > 0
                            ? currentUser?.discordUserDiscriminator
                            : "Individual"}{" "}
                        Quests
                    </div>

                    <div className={s.boardQuest_scrollableArea}>
                        {/* Is Loading */}
                        {(isFetchingUserQuests ||
                            isSubmitting ||
                            isFetchingUserRewards ||
                            isFetchingUser) && (
                            <div className={s.boardQuest_loading}>
                                <img src="/img/sharing-ui/clamsparkle.gif" alt="Loading data" />
                                {/* <div>Fetching data...</div> */}
                            </div>
                        )}
                        {/*  Render error message */}
                        {currentQuests?.isError && <div>{currentQuests?.message}</div>}

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
                                        <div className={s.boardQuest_list_container}>
                                            <div className={s.boardQuest_list_content}>
                                                <div>
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
                                                {isDone && <div>Completed</div>}
                                            </div>
                                            <div className={s.boardQuest_list_result}>
                                                {!isDone && (
                                                    <>
                                                        {type.name === Enums.DISCORD_AUTH && (
                                                            <a
                                                                className={s.boardQuest_pinkBtn}
                                                                href={getDiscordAuthLink()}
                                                                target="_blank"
                                                                disabled={isDone}
                                                            >
                                                                Auth
                                                            </a>
                                                        )}
                                                        {type.name === Enums.TWITTER_AUTH && (
                                                            <a
                                                                className={s.boardQuest_pinkBtn}
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
                                                                className={s.boardQuest_pinkBtn}
                                                                onClick={() => DoQuest(item)}
                                                                disabled={isDone}
                                                            >
                                                                Follow
                                                            </button>
                                                        )}
                                                        {type.name === Enums.TWITTER_RETWEET && (
                                                            <button
                                                                className={s.boardQuest_pinkBtn}
                                                                onClick={() => DoQuest(item)}
                                                                disabled={isDone}
                                                            >
                                                                Retweet
                                                            </button>
                                                        )}
                                                        {type.name ===
                                                            Enums.ANOMURA_SUBMISSION_QUEST && (
                                                            <button
                                                                className={s.boardQuest_pinkBtn}
                                                                onClick={() => DoQuest(item)}
                                                                disabled={isDone}
                                                            >
                                                                Do
                                                            </button>
                                                        )}
                                                    </>
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
