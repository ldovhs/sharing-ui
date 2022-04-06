import React, { useEffect, useState, useContext } from "react";

import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import axios from "axios";

import { withPendingRewardQuery } from "shared/HOC/reward";

const UserClaimReward = ({ session, data }) => {
    // const [claimableReward, setClaimableReward] = useState(data);
    const [error, setError] = useState(null);
    const [showTask, setShowTask] = useState(true);
    const { web3Error, SignOut } = useContext(Web3Context);
    console.log(data);
    useEffect(async () => {
        if (data?.isError) {
            setError(data?.isError);
        }
        if (
            session &&
            !data?.isError &&
            data?.pendingReward?.wallet &&
            data?.pendingReward?.wallet.toLowerCase() !== session?.user?.address?.toLowerCase()
        ) {
            console.log(data?.pendingReward.wallet.toLowerCase());
            console.log(session?.user?.address?.toLowerCase());
            setError(
                `Your login account ${session?.user?.address?.toLowerCase()} does not have this reward`
            );
        }
    }, []);

    const onClaim = async () => {
        const { generatedURL, isClaimed, rewardTypeId, quantity, userId, wallet } =
            data.pendingReward;

        const res = await axios.post("/api/admin/claimReward", {
            generatedURL,
            isClaimed,
            rewardTypeId,
            quantity,
            userId,
            wallet,
        });
        if (res.data?.isError) {
            setError(res.data?.message);
        } else {
            setClaimableReward((prevState) => {
                return {
                    ...prevState,
                    isClaimed: true,
                };
            });
        }
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
                    {data?.pendingReward && !error && (
                        <>
                            <div className={s.boardQuest_title}>
                                <div>
                                    You won {data?.pendingReward.rewardTypeId}{" "}
                                    {data?.pendingReward.rewardType.reward}
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
                                    disabled={data?.pendingReward?.isClaimed}
                                >
                                    {!data?.pendingReward?.isClaimed ? "Claim" : "Already Claimed"}
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
export default withPendingRewardQuery(UserClaimReward);
//  return (
//      <div className={s.boardBig}>
//          <div className={s.boardBig_contentContainer}>
//              <div className={s.boardBig_title}>
//                  You won {claimableReward.quantity} {claimableReward.rewardType.reward}
//              </div>
//              {showTask && (
//                  <div className={s.boardBig_rewardContainer}>
//                      <div className={s.boardBig_rewardText}>
//                          Share your Reward, and get a chance to get more rewards.
//                      </div>
//                      <div className={s.boardBig_rewardButtons}>
//                          <a
//                              target="_blank"
//                              href="https://twitter.com/intent/tweet?text=Thank%20you%20Aedi%20for%20the%20Gitfs!%0a%0aJoin us at anomuragame.com/share?code=a1234%0a%0ahttps://twitter.com/AnomuraGame/status/012345678910."
//                              className={s.boardBig_rewardButton}
//                          >
//                              <img src="/img/sharing-ui/invite/button1.png" />
//                              <div>
//                                  <span>Tweet</span>
//                              </div>
//                          </a>
//                          <a
//                              className={s.boardBig_rewardButton}
//                              href=""
//                              onClick={(e) => onSkip(e)}
//                          >
//                              <img src="/img/sharing-ui/invite/button1.png" />
//                              <div>
//                                  <span>Skip</span>
//                              </div>
//                          </a>
//                      </div>
//                  </div>
//              )}
//              <button
//                  className={s.boardBig_claimBtn}
//                  onClick={onClaim}
//                  disabled={claimableReward.isClaimed}
//              >
//                  {!claimableReward.isClaimed ? "Claim" : "Already Claimed"}
//              </button>
//              <div className={s.boardBig_disconnectBtn} onClick={() => SignOut()}>
//                  <img src="/img/sharing-ui/invite/button1.png" />
//                  <div>
//                      <span>Disconnect</span>
//                  </div>
//              </div>
//          </div>
//      </div>
//  );
