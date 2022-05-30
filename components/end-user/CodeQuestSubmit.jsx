import React, { useEffect, useState, useContext, useCallback } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import { BoardSmallDollarSign } from ".";

const SUBMITTABLE = 1;
const SUBMITTED = 2;
const OVERDUE = 3;

const CodeQuestSubmit = ({ session, onSubmit, isSubmitting, isFetchingUserQuests, userQuests }) => {
    const [submissionQuest, setSubmissionQuest] = useState(null);
    const [inputError, setInputError] = useState(null);
    const [inputCode, setInputCode] = useState(null);
    const { SignOut, TryValidate } = useContext(Web3Context);
    const [currentView, setView] = useState(SUBMITTABLE);
    const router = useRouter();

    useEffect(async () => {
        if (userQuests && router) {
            let event = router.query.event;

            let codeQuestOfThisEvent = userQuests.find(
                (q) => q.type.name === Enums.CODE_QUEST && q.extendedQuestData.codeEvent === event
            );

            if (!codeQuestOfThisEvent) {
                console.log(2);
                return setView(OVERDUE);
            }

            setSubmissionQuest(codeQuestOfThisEvent);

            if (
                codeQuestOfThisEvent?.extendedQuestData.hasOwnProperty("endDate") &&
                codeQuestOfThisEvent?.extendedQuestData?.endDate !== null
            ) {
                let [endDate] = codeQuestOfThisEvent?.extendedQuestData?.endDate.split("T");
                let [today] = new Date().toISOString().split("T");

                if (today > endDate) {
                    return setView(OVERDUE);
                }
            }

            if (codeQuestOfThisEvent.isDone) {
                return setView(SUBMITTED);
            }
        }
    }, [userQuests]);

    const handleOnChange = (e, error) => {
        if (error) {
            setInputError(null);
        }
        let text = e.target.value;
        setInputCode(text);
    };
    const debouncedChangeHandler = useCallback(debounce(handleOnChange, 300), []);

    async function handleOnSubmit() {
        /** compare the code */
        if (!inputCode) {
            return;
        }
        if (
            inputCode.toLowerCase() !== submissionQuest?.extendedQuestData.secretCode.toLowerCase()
        ) {
            setInputError("Incorrect Code");
            return;
        }

        /** Submit this quest */
        const { questId, type, rewardTypeId, quantity, extendedQuestData } = submissionQuest;

        let submission = {
            questId,
            type,
            rewardTypeId,
            quantity,
            extendedQuestData,
        };
        let res = await onSubmit(submission, userQuests);

        if (res) {
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
                        {(isSubmitting || isFetchingUserQuests) && (
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
                        )}
                        {!isSubmitting && !isFetchingUserQuests && (
                            <>
                                {submissionQuest && currentView === SUBMITTABLE && (
                                    <>
                                        <div className={s.board_title}>{submissionQuest.text}</div>
                                        <div className={s.board_input_wrapper}>
                                            <input
                                                type="text"
                                                className={s.board_input_custom}
                                                placeholder="ENTER CODE"
                                                onChange={(e) =>
                                                    debouncedChangeHandler(e, inputError)
                                                }
                                                // maxLength={15}
                                            />
                                            <label className={s.board_input_error}>
                                                {inputError}
                                            </label>
                                        </div>
                                        <div className={s.board_buttonContainer}>
                                            {/* <button
                                                className={s.board_blackBtn}
                                                onClick={() => {
                                                    setView(UPLOADABLE);
                                                    setImageFile(null);
                                                    setImageSrc(null);
                                                    setError(null);
                                                }}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small 2.png`}
                                                    alt="Go Back"
                                                />
                                                <div>
                                                    <span>Back</span>
                                                </div>
                                            </button> */}
                                            <button
                                                className={s.board_pinkBtn}
                                                onClick={handleOnSubmit}
                                                disabled={
                                                    submissionQuest?.isDone ||
                                                    isSubmitting ||
                                                    isFetchingUserQuests
                                                }
                                            >
                                                <img
                                                    src={
                                                        !submissionQuest?.isDone
                                                            ? `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small.png`
                                                            : `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small 2.png`
                                                    }
                                                    alt="Submit"
                                                />
                                                <div>
                                                    <span>{submissionQuest.quantity}</span>
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
                                            </button>
                                        </div>
                                    </>
                                )}
                                {submissionQuest && currentView === SUBMITTED && (
                                    <>
                                        <div className={s.board_title}>
                                            Thanks for your submission!
                                        </div>
                                        <button
                                            className={s.board_tealBtn}
                                            onClick={() => {
                                                router.push("/");
                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                alt="Back To Quest page"
                                            />
                                            <div>
                                                <span>Back to quests</span>
                                            </div>
                                        </button>
                                    </>
                                )}
                                {currentView === OVERDUE && (
                                    <>
                                        <div className={s.board_title}>This event is over!</div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/*  Disconnect */}
            {!isFetchingUserQuests && (
                <button className={s.board_disconnect} onClick={() => SignOut()}>
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

const firstHOC = withUserQuestSubmit(CodeQuestSubmit);
export default withUserQuestQuery(firstHOC);

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
