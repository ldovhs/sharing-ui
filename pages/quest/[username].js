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
    // const isAuthenticating = status === "loading";

    // if (session) {
    //     console.log(util.inspect(session, { showHidden: false, depth: null, colors: true }));
    // }

    const [quests, setQuests] = useState([]);
    useEffect(() => {
        if (web3Error) {
            setError(web3Error);
        }
    }, [web3Error]);

    useEffect(async () => {
        if (!router.isReady) return;
        console.log(1);
        const res = await axios.get("/api/admin/quest");
        //console.log(res);
        setQuests(res.data);
        // if (
        //     session &&
        //     (res.data.isError ||
        //         res.data.pendingReward.wallet.toLowerCase() !==
        //             session?.user?.address?.toLowerCase())
        // ) {
        //     console.log(res.data.pendingReward.wallet.toLowerCase());
        //     console.log(session?.user?.address?.toLowerCase());
        //     setError(
        //         `Your login account ${session?.user?.address?.toLowerCase()} does not have this reward`
        //     );
        // } else {
        //     console.log(`claimable reward: ${JSON.stringify(res.data.pendingReward)}`, {
        //         deep: true,
        //     });
        //     setClaimableReward(res.data.pendingReward);
        // }
    }, [router.isReady, session]);

    const onSkip = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowTask(false);
    };
    console.log(quests);
    const renderQuestBoard = () => {
        console.log(12345);
        // user is logged in, we need to check if the wallet account matches with our database
        // if (
        //     claimableReward &&
        //     !error &&
        //     claimableReward.wallet.toLowerCase() === session?.user?.address?.toLowerCase()
        // ) {
        return (
            <div className={s.boardBig}>
                <div className={s.boardBig_contentContainer}>
                    <div className={s.boardBig_title}>Quests Page test</div>
                    <div className="card">
                        {showTask && (
                            <div className={s.boardBig_rewardContainer}>
                                <div className="card-body">
                                    {quests &&
                                        quests?.map((item, index, row) => {
                                            console.log(item);
                                            return (
                                                <React.Fragment key={index}>
                                                    <div className="verify-content">
                                                        <div className="d-flex align-items-center">
                                                            <div className="primary-number">
                                                                <h5 className="mb-0">quest text</h5>
                                                                {/* <small>{item.description}</small> */}
                                                                <br />
                                                                <span className="text-success">
                                                                    {/* {item.isRequired
                                                                ? "Required"
                                                                : "Optional"} */}
                                                                    Completed
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button className=" btn btn-outline-primary">
                                                            {/* <Link
                                                        href={`${router.pathname}/?id=${item.id}`}
                                                    > */}
                                                            Manage
                                                            {/* </Link> */}
                                                        </button>
                                                    </div>

                                                    {index + 1 !== row.length && (
                                                        <hr className="dropdown-divider my-4" />
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    {/* <div className={s.boardBig_rewardText}>
                                    Share your Reward, and get a chance to get more rewards.
                                </div> */}
                                    {/* <div className={s.boardBig_rewardButtons}>
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
                            </div> */}
                                </div>
                            </div>
                        )}
                        {/* <button
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
                    </div> */}
                    </div>
                </div>
            </div>
        );
        // } else {
        //     return (
        //         <div className={s.boardBig}>
        //             <div className={s.boardBig_contentContainer}>
        //                 {/* <div className={s.boardBig_title}>{error}</div> */}
        //                 <div className={s.boardBig_rewardContainer}>
        //                     <div className={s.boardBig_disconnectBtn} onClick={() => SignOut()}>
        //                         <img src="/img/sharing-ui/invite/button1.png" />
        //                         <div>
        //                             <span>Disconnect</span>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     );
        // }
    };

    // const renderConnectToWallet = () => {
    //     return (
    //         <div className={s.board}>
    //             {claimableReward && <div className={s.board_congrats}> Congratulations</div>}
    //             <img
    //                 className={s.board_title}
    //                 src="/img/sharing-ui/invite/anomura_big.png"
    //                 alt="sign"
    //             />
    //             <img
    //                 className={s.board_welcome}
    //                 src="/img/sharing-ui/invite/welcome.png"
    //                 alt="welcome"
    //             />
    //             {claimableReward && (
    //                 <button
    //                     // onClick={() => TryConnectAsUser()}
    //                     onClick={() => setModalOpen(true)}
    //                     className={s.board_button}
    //                     disabled={isAuthenticating}
    //                 >
    //                     {isAuthenticating ? `Authenticating...` : `Connect your wallet`}
    //                 </button>
    //             )}
    //             {!session && error && (
    //                 <button
    //                     onClick={() => SignOut()}
    //                     className={s.board_button}
    //                     disabled={isAuthenticating}
    //                 >
    //                     Disconnect
    //                 </button>
    //             )}
    //         </div>
    //     );
    // };

    // const onClaim = async () => {
    //     const { generatedURL, isClaimed, rewardTypeId, quantity, userId, wallet } = claimableReward;

    //     const res = await axios.post("/api/admin/claimReward", {
    //         generatedURL,
    //         isClaimed,
    //         rewardTypeId,
    //         quantity,
    //         userId,
    //         wallet,
    //     });
    //     if (res.data?.isError) {
    //         setError(res.data?.message);
    //     } else {
    //         setClaimableReward((prevState) => {
    //             return {
    //                 ...prevState,
    //                 isClaimed: true,
    //             };
    //         });
    //     }
    // };

    return (
        <>
            <div className={s.app}>
                {/* {!currentAccount ? renderConnectToWallet() : renderClaimBoard()} */}
                {/* {!session ? renderConnectToWallet() : renderClaimBoard()} */}
                {renderQuestBoard()}
                <div className={s.foreground}>
                    {/* {claimableReward && !error && (
                        <div>
                            You won {claimableReward.quantity} {claimableReward.rewardType.reward}
                        </div>
                    )}
                    {error && <div>{error} </div>} */}
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
