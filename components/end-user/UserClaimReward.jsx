import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import axios from "axios";

export default function UserClaimReward({ session }) {
    const router = useRouter();
    const { username, specialcode } = router.query;
    const [claimableReward, setClaimableReward] = useState();
    const [error, setError] = useState(null);
    const [showTask, setShowTask] = useState(true);
    const { web3Error, SignOut } = useContext(Web3Context);

    useEffect(async () => {
        if (!router.isReady) return;

        const res = await axios.get("/api/admin/pendingReward", {
            params: {
                username,
                generatedURL: specialcode,
            },
        });

        if (
            session &&
            (res.data.isError ||
                res.data.pendingReward.wallet.toLowerCase() !==
                    session?.user?.address?.toLowerCase())
        ) {
            setError(
                `Your login account ${session?.user?.address?.toLowerCase()} does not have this reward`
            );
        } else {
            setClaimableReward(res.data.pendingReward);
        }
    }, [router.isReady]);

    const onClaim = async () => {
        const { generatedURL, isClaimed, rewardTypeId, quantity, userId, wallet } = claimableReward;

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
                    {claimableReward && !error && (
                        <>
                            <div className={s.boardQuest_title}>
                                <div>
                                    You won {claimableReward.rewardTypeId}{" "}
                                    {claimableReward.rewardType.reward}
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
                                    disabled={claimableReward?.isClaimed}
                                >
                                    {!claimableReward?.isClaimed ? "Claim" : "Already Claimed"}
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
}

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
