import React, { useEffect, useState, useContext, useCallback } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import {
    withUserUnstoppableAuthQuestQuery,
    withUserUnstoppableAuthQuestSubmit,
} from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import {
    DisconnectButton,
    BackToMainBoardButton,
    BoardSmallDollarSign,
    PinkLargeButton,
} from "../shared";

import UAuth from "@uauth/js";
const { default: Resolution } = require("@unstoppabledomains/resolution");
const resolution = new Resolution();

const uauth = new UAuth({
    clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLE_REDIRECT_URI,
    scope: "openid wallet",
});

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;
const STEP_4 = 4;
const SUBMITTED = 5;
const OVERDUE = 6;
const ERROR = 7;

const UnstoppableAuth = ({ session, onSubmit, isSubmitting, isFetchingUserQuests, userQuests }) => {
    const [submissionQuest, setSubmissionQuest] = useState(null);
    const [error, setError] = useState(null);
    const [uauthUser, setUauthUser] = useState(null);
    const { SignOut } = useContext(Web3Context);
    const [currentView, setView] = useState(STEP_1);
    const router = useRouter();

    useEffect(async () => {
        if (userQuests) {
            let unstoppableAuthQuest = userQuests.find(
                (q) => q.type.name === Enums.UNSTOPPABLE_AUTH
            );

            if (!unstoppableAuthQuest) {
                return setView(OVERDUE);
            }

            setSubmissionQuest(unstoppableAuthQuest);

            if (unstoppableAuthQuest.isDone) {
                return setView(SUBMITTED);
            }
        }
    }, [userQuests]);

    const handleUnstoppableLogin = async () => {
        // let auth = "quan612.crypto";

        try {
            // let test = await resolution.addr(auth, "ETH"); // resolver
            const authorization = await uauth.loginWithPopup();
            console.log(authorization);
            // let test = await resolution.owner(auth);
            if (authorization) {
                let user = await uauth.user();
                console.log(user);
                setUauthUser(user.sub);
                setView(STEP_4);
            } else {
                console.log(authorization);
                setError("something wrong");
                setView(ERROR);
            }
        } catch (error) {
            setError(error.message);
            setView(ERROR);
        }
    };

    async function handleOnSubmit() {
        /** Submit this quest */
        const { questId, type, rewardTypeId, quantity, extendedQuestData } = submissionQuest;
        if (!uauthUser) {
            return;
        }
        let submission = {
            questId,
            type,
            rewardTypeId,
            quantity,
            extendedQuestData,
            uauthUser,
        };
        let res = await onSubmit(submission, userQuests);

        if (res.isError) {
            setError(res.message);
            setView(ERROR);
        } else {
            setSubmissionQuest((prevState) => ({ ...prevState, isDone: true }));
            return setView(SUBMITTED);
        }
    }

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {(isSubmitting || isFetchingUserQuests) && <BoardSmallLoadingContainer />}
                        {!isSubmitting && !isFetchingUserQuests && (
                            <>
                                {submissionQuest && currentView === STEP_1 && (
                                    <>
                                        <div className={s.board_title}>{submissionQuest.text}</div>

                                        <div className={s.board_text}>Placeholder text</div>

                                        <PinkLargeButton
                                            text={"Go Next"}
                                            onClick={() => setView(STEP_2)}
                                        />
                                        {/* <div className={s.board_buttonContainer}>
                                            <button
                                                className={s.board_singleClaimBtn}
                                                onClick={handleOnSubmit}
                                                disabled={
                                                    submissionQuest?.isDone ||
                                                    isSubmitting ||
                                                    isFetchingUserQuests
                                                }
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                                    alt="Submit"
                                                />
                                                <div>
                                                    <div>
                                                        Claim {submissionQuest.quantity}
                                                        {submissionQuest.rewardType.reward.match(
                                                            "hell"
                                                        ) && (
                                                            <img
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                                                alt="reward icon"
                                                            />
                                                        )}
                                                        {submissionQuest.rewardType.reward.match(
                                                            /bowl|Bowl/
                                                        ) && (
                                                            <img
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                                                alt="reward icon"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        </div> */}
                                    </>
                                )}
                                {currentView === STEP_2 && (
                                    <>
                                        <div className={s.board_text}>
                                            Go to unstoppabledomain.com and buy your crypto domain
                                        </div>
                                        <PinkLargeButton
                                            text={"Go Next"}
                                            onClick={() => setView(STEP_3)}
                                        />
                                    </>
                                )}
                                {currentView === STEP_3 && (
                                    <>
                                        <div className={s.board_text}>
                                            Authenticate your crypto domain
                                        </div>
                                        <PinkLargeButton
                                            text={"Authenticate"}
                                            onClick={() => handleUnstoppableLogin()}
                                        />
                                    </>
                                )}
                                {currentView === STEP_4 && (
                                    <>
                                        <div className={s.board_text}>
                                            Confirmed to link unstoppable domain {uauthUser}
                                        </div>
                                        <ClaimButton
                                            onClick={handleOnSubmit}
                                            isSubmitting={isSubmitting}
                                            isFetchingUserQuests={isFetchingUserQuests}
                                            submissionQuest={submissionQuest}
                                        />
                                    </>
                                )}
                                {currentView === ERROR && (
                                    <>
                                        <div className={s.board_text}>{error}</div>
                                        <PinkLargeButton
                                            text={"Go Back"}
                                            onClick={() => setView(STEP_1)}
                                        />
                                    </>
                                )}

                                {submissionQuest && currentView === SUBMITTED && (
                                    <>
                                        <div className={s.board_title}>
                                            Success! Quest completed.
                                        </div>
                                        <BackToMainBoardButton />
                                    </>
                                )}
                                {currentView === OVERDUE && (
                                    <>
                                        <div className={s.board_title}>
                                            Sorry, you're too late. All the $SHELL has been found
                                            for this quest.
                                        </div>
                                        <BackToMainBoardButton />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <DisconnectButton />
        </div>
    );
};

const firstHOC = withUserUnstoppableAuthQuestSubmit(UnstoppableAuth);
export default withUserUnstoppableAuthQuestQuery(firstHOC);

const BoardSmallLoadingContainer = () => {
    return (
        <div className={s.board_loading}>
            <div className={s.board_loading_wrapper}>
                <img
                    src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                    alt="Loading data"
                />
                <div className={s.board_loading_wrapper_text}>
                    Loading
                    <span className={s.board_loading_wrapper_text_ellipsis} />
                </div>
            </div>
        </div>
    );
};

const ClaimButton = ({ onClick, isSubmitting, isFetchingUserQuests, submissionQuest }) => {
    return (
        <div className={s.claimBtn}>
            <button
                onClick={onClick}
                disabled={submissionQuest.isDone || isSubmitting || isFetchingUserQuests}
            >
                <img
                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                    alt="Submit"
                />
                <div>
                    <div>
                        Claim {submissionQuest.quantity}
                        {submissionQuest.rewardType.reward.match("hell") && (
                            <img
                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                alt="reward icon"
                            />
                        )}
                        {submissionQuest.rewardType.reward.match(/bowl|Bowl/) && (
                            <img
                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                alt="reward icon"
                            />
                        )}
                    </div>
                </div>
            </button>
        </div>
    );
};
