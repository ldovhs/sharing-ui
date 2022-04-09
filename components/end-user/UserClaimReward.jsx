import React, { useEffect, useState, useContext } from "react";

import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import axios from "axios";

import { withClaimableRewardQuery, withClaimRewardSubmit } from "shared/HOC/reward";

const UserClaimReward = ({ session, reward, onSubmitReward }) => {
    const [error, setError] = useState(null);
    const [showTask, setShowTask] = useState(true);
    const { SignOut } = useContext(Web3Context);

    useEffect(async () => {
        if (
            session &&
            !reward?.isError &&
            reward?.pendingReward?.wallet &&
            reward?.pendingReward?.wallet.toLowerCase() !== session?.user?.address?.toLowerCase()
        ) {
            setError(
                `Your login account ${session?.user?.address?.toLowerCase()} does not own this reward`
            );
        }
        if (reward?.isError) {
            setError(reward?.isError);
        }
    }, [reward]);

    const onClaim = async () => {
        await onSubmitReward(reward.pendingReward);
    };

    const onSkip = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowTask(false);
    };
    return (
        <div className={s.boardQuest}>
            <div className={s.boardQuest_container}>
                <div className={s.boardQuest_wrapper}>
                    {reward?.pendingReward && !error && (
                        <>
                            <div className={s.boardQuest_title}>
                                <div>
                                    You won {reward?.pendingReward.rewardTypeId}{" "}
                                    {reward?.pendingReward.rewardType.reward}
                                </div>
                            </div>

                            <div className={s.boardQuest_scrollableArea}>
                                {showTask && (
                                    <div className={s.boardQuest_list_container}>
                                        <div className={s.boardQuest_list_content}>
                                            <div>
                                                Share your Reward, and get a chance to get more
                                                rewards.
                                            </div>
                                            {/* <div>place holder</div> */}
                                        </div>
                                        <div className={s.boardQuest_list_result}>
                                            <a
                                                target="_blank"
                                                href="https://twitter.com/intent/tweet?text=Thank%20you%20Aedi%20for%20the%20Gitfs!%0a%0aJoin us at anomuragame.com/share?code=a1234%0a%0ahttps://twitter.com/AnomuraGame/status/012345678910."
                                                className={s.boardBig_rewardButton}
                                            >
                                                <img src="/img/sharing-ui/invite/button1.png" />
                                                <div>
                                                    <span>Tweet</span>
                                                </div>
                                            </a>
                                            <a
                                                className={s.boardBig_rewardButton}
                                                href=""
                                                onClick={(e) => onSkip(e)}
                                            >
                                                <img src="/img/sharing-ui/invite/button1.png" />
                                                <div>
                                                    <span>Skip</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )}
                                <button
                                    className={s.boardQuest_yellowText}
                                    onClick={() => SignOut()}
                                >
                                    Disconnect
                                </button>
                            </div>
                            <div className={s.boardQuest_footer}>
                                <span className={s.boardQuest_footer_line} />
                                <button
                                    className={s.boardQuest_orangeBtn}
                                    onClick={onClaim}
                                    disabled={reward?.pendingReward?.isClaimed}
                                >
                                    {!reward?.pendingReward?.isClaimed
                                        ? "Claim"
                                        : "Already Claimed"}
                                </button>
                            </div>
                        </>
                    )}

                    {error && (
                        <>
                            <div className={`${s.boardQuest_title} mt-40`}>{error}</div>
                            <button className={s.boardQuest_yellowText} onClick={() => SignOut()}>
                                Disconnect
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
const SubmitReward = withClaimRewardSubmit(UserClaimReward);
export default withClaimableRewardQuery(SubmitReward);
