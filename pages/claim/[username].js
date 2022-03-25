import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import s from "/sass/claim/claim.module.css";
import { SiteContext } from "@context/SiteContext";
import axios from "axios";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
const util = require("util");

function Claim() {
    const router = useRouter();
    const { username, specialcode } = router.query;

    const [claimableReward, setClaimableReward] = useState("");
    const [error, setError] = useState(null);
    const [showTask, setShowTask] = useState(true);
    // const { ConnectWallet, currentAccount } = useContext(SiteContext);
    // let ethereum;

    const { data: session, status } = useSession({ required: false });
    const { web3Error, TryConnectAsUser } = useContext(Web3Context);
    if (session) {
        console.log(util.inspect(session, { showHidden: false, depth: null, colors: true }));
    }

    useEffect(async () => {
        if (!router.isReady) return;

        const res = await axios.get("/api/admin/pendingReward", {
            params: {
                username,
                generatedURL: specialcode,
            },
        });

        if (!res.data.pendingReward) {
            setError("Invalid claim");
        } else {
            console.log(res.data.pendingReward);
            setClaimableReward(res.data.pendingReward);
        }
    }, [router.isReady]);

    useEffect(() => {
        ethereum = window.ethereum;
    }),
        [];

    // useEffect(() => {
    //     if (currentAccount) console.log(currentAccount);
    // }),
    //     [currentAccount];

    const onSkip = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowTask(false);
    };

    const renderClaimBoard = () => {
        // user is logged in, we need to check if the wallet account matches with our database
        if (
            claimableReward &&
            session.user?.address?.toLowerCase() === claimableReward.wallet.toLowerCase()
        ) {
            return (
                <div className={s.boardBig}>
                    <div className={s.boardBig_contentContainer}>
                        <div className={s.boardBig_title}>
                            You won {claimableReward.tokens} {claimableReward.rewardType.reward}
                        </div>
                        {showTask && (
                            <div className={s.boardBig_rewardContainer}>
                                <div className={s.boardBig_rewardText}>
                                    Share your Reward, and get a chance to get more rewards.
                                </div>
                                <div className={s.boardBig_rewardButtons}>
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
                            className={s.boardBig_claimBtn}
                            onClick={onClaim}
                            disabled={claimableReward.isClaimed}
                        >
                            {!claimableReward.isClaimed ? "Claim" : "Claimed previously"}
                        </button>
                    </div>{" "}
                </div>
            );
        } else {
            return (
                <div className={s.boardBig}>
                    <div className={s.boardBig_contentContainer}>
                        <div className={s.boardBig_title}>
                            Sorry your account does not match the account for this reward
                        </div>
                        <div className={s.boardBig_rewardContainer}></div>
                    </div>
                </div>
            );
        }
    };

    const renderConnectToWallet = () => {
        return (
            <div className={s.board}>
                {claimableReward && <div className={s.board_congrats}> Congratulations</div>}
                <img
                    className={s.board_title}
                    src="/img/sharing-ui/invite/anomura_big.png"
                    alt="sign"
                />
                <img
                    className={s.board_welcome}
                    src="/img/sharing-ui/invite/welcome.png"
                    alt="welcome"
                />
                {claimableReward && (
                    <button onClick={() => TryConnectAsUser()} className={s.board_button}>
                        Connect your wallet
                    </button>
                )}
            </div>
        );
    };

    const onClaim = async () => {
        const {
            discordId,
            generatedURL,
            isClaimed,
            rewardTypeId,
            tokens,
            twitter,
            userId,
            wallet,
        } = claimableReward;

        const res = await axios.post("/api/admin/claimReward", {
            discordId,
            generatedURL,
            isClaimed,
            rewardTypeId,
            tokens,
            twitter,
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

    return (
        <div className={s.app}>
            {/* {!currentAccount ? renderConnectToWallet() : renderClaimBoard()} */}
            {!session ? renderConnectToWallet() : renderClaimBoard()}
            <div className={s.foreground}>
                {claimableReward && (
                    <div>
                        You won {claimableReward.tokens} {claimableReward.rewardType.reward}
                    </div>
                )}
                {error && <div>{error}</div>}
            </div>
        </div>
    );
}

export default Claim;
