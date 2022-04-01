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
            <div className={s.boardQuest}>
                <div className={s.boardQuest_wrapperImg}>
                    <div className={s.boardQuest_wrapper}>
                        <div className={s.boardQuest_title}>Quests Page test</div>
                        <div className={s.boardQuest_scrollableArea}>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">Manage</button>
                            </div>
                            <div class="verify-content">
                                <div class="d-flex align-items-center">
                                    <div class="primary-number">
                                        <h5 class="mb-0">quest text</h5>
                                        <br />
                                        <span class="text-success">Completed</span>
                                    </div>
                                </div>
                                <button class=" btn btn-outline-primary">LAST</button>
                            </div>
                        </div>
                        <div className={s.boardQuest_footer}>
                            <span className={s.boardQuest_footer_line} />
                            <button className={s.boardQuest_disconnect}>Disconnect</button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
