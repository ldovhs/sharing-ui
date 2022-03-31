import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import s from "/sass/claim/claim.module.css";
import axios from "axios";
import { Web3Context } from "@context/Web3Context";
import { useSession } from "next-auth/react";
import { Modal, UserLogin } from "@components/admin/ComponentIndex";

const util = require("util");

function Claim() {
    const router = useRouter();
    const { username, specialcode } = router.query;
    const [isModalOpen, setModalOpen] = useState(false);

    const [claimableReward, setClaimableReward] = useState("");
    const [error, setError] = useState(null);
    const [showTask, setShowTask] = useState(true);

    const { data: session, status } = useSession({ required: false });
    const { web3Error, TryConnectAsUser, SignOut } = useContext(Web3Context);
    const isAuthenticating = status === "loading";

    // if (session) {
    //     console.log(util.inspect(session, { showHidden: false, depth: null, colors: true }));
    // }

    useEffect(() => {
        if (web3Error) {
            setError(web3Error);
        }
    }, [web3Error]);

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
            console.log(res.data.pendingReward.wallet.toLowerCase());
            console.log(session?.user?.address?.toLowerCase());
            setError(
                `Your login account ${session?.user?.address?.toLowerCase()} does not have this reward`
            );
        } else {
            console.log(`claimable reward: ${JSON.stringify(res.data.pendingReward)}`, {
                deep: true,
            });
            setClaimableReward(res.data.pendingReward);
        }
    }, [router.isReady, session]);

    useEffect(() => {
        ethereum = window.ethereum;
    }),
        [];

    const onSkip = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowTask(false);
    };

    const renderClaimBoard = () => {
        console.log(123);
        // user is logged in, we need to check if the wallet account matches with our database
        if (
            claimableReward &&
            !error &&
            claimableReward.wallet.toLowerCase() === session?.user?.address?.toLowerCase()
        ) {
            return (
                <div className={s.boardBig}>
                    <div className={s.boardBig_contentContainer}>
                        <div className={s.boardBig_title}>
                            You won {claimableReward.quantity} {claimableReward.rewardType.reward}
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
                            {!claimableReward.isClaimed ? "Claim" : "Already Claimed"}
                        </button>
                        <div className={s.boardBig_disconnectBtn} onClick={() => SignOut()}>
                            <img src="/img/sharing-ui/invite/button1.png" />
                            <div>
                                <span>Disconnect</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={s.boardBig}>
                    <div className={s.boardBig_contentContainer}>
                        {/* <div className={s.boardBig_title}>{error}</div> */}
                        <div className={s.boardBig_rewardContainer}>
                            <div className={s.boardBig_disconnectBtn} onClick={() => SignOut()}>
                                <img src="/img/sharing-ui/invite/button1.png" />
                                <div>
                                    <span>Disconnect</span>
                                </div>
                            </div>
                        </div>
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
                    <button
                        // onClick={() => TryConnectAsUser()}
                        onClick={() => setModalOpen(true)}
                        className={s.board_button}
                        disabled={isAuthenticating}
                    >
                        {isAuthenticating ? `Authenticating...` : `Connect your wallet`}
                    </button>
                )}
                {!session && error && (
                    <button
                        onClick={() => SignOut()}
                        className={s.board_button}
                        disabled={isAuthenticating}
                    >
                        Disconnect
                    </button>
                )}
            </div>
        );
    };

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

    return (
        <>
            <div className={s.app}>
                {/* {!currentAccount ? renderConnectToWallet() : renderClaimBoard()} */}
                {!session ? renderConnectToWallet() : renderClaimBoard()}
                <div className={s.foreground}>
                    {claimableReward && !error && (
                        <div>
                            You won {claimableReward.quantity} {claimableReward.rewardType.reward}
                        </div>
                    )}
                    {error && <div>{error} </div>}
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Test"
                render={(modal) => <UserLogin closeModal={() => setModalOpen(false)} />}
                isConfirm={true}
            />
        </>
    );
}

export default Claim;
