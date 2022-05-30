import React, { useEffect, useState, useContext, useRef } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import axios from "axios";
import { withUserQuestQuery, withUserImageQuestSubmit } from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import { BoardSmallDollarSign } from ".";
import * as tf from "@tensorflow/tfjs";
import * as nsfwjs from "@nsfw-filter/nsfwjs";

const UPLOADABLE = 0;
const SUBMITTABLE = 1;
const SUBMITTED = 2;

const ImageUpload = ({
    session,
    onSubmitImageQuest,
    isSubmitting,
    isFetchingUserQuests,
    userQuests,
}) => {
    const [submissionQuest, setSubmissionQuest] = useState(null);
    const [submittedQuest, setSubmittedQuest] = useState(null);
    const [error, setError] = useState(null);
    const { SignOut, TryValidate } = useContext(Web3Context);
    const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [nsfwModel, setNSFWModel] = useState(null);
    const [currentView, setView] = useState(UPLOADABLE);
    const [imageSrc, setImageSrc] = useState();
    const [imageFile, setImageFile] = useState(null);

    const router = useRouter();
    const hiddenFileInput = useRef(null);
    const imageEl = useRef(null);

    useEffect(async () => {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
                navigator.userAgent
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                navigator.userAgent.substr(0, 4)
            )
        ) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
        const ethereum = window.ethereum;
        setIsMetamaskDisabled(!ethereum || !ethereum.on);

        let model = await nsfwjs.load();
        setNSFWModel(model);
    }, []);

    useEffect(async () => {
        if (userQuests) {
            let findSubmissionQuest = userQuests.find(
                (q) => q.type.name === Enums.IMAGE_UPLOAD_QUEST
            );

            if (findSubmissionQuest) {
                if (findSubmissionQuest.isDone) {
                    let submittedQuestBefore = await axios.get(
                        `${Enums.BASEPATH}/api/user/quest/${findSubmissionQuest.questId}`
                    );

                    if (submittedQuestBefore) {
                        setSubmittedQuest(submittedQuestBefore.data);
                    }

                    setView(SUBMITTED);
                }
            }

            setSubmissionQuest(findSubmissionQuest);
        }
    }, [userQuests]);

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        hiddenFileInput.current.click();
    };

    function handleOnChange(changeEvent) {
        const reader = new FileReader();

        reader.onload = function (onLoadEvent) {
            setImageSrc(onLoadEvent.target.result);
        };

        reader.readAsDataURL(changeEvent.target.files[0]);
        setImageFile(changeEvent.target.files[0]);
        setView(SUBMITTABLE);
    }
    // console.log(submittedQuest);

    async function handleOnSubmit() {
        const predictions = await nsfwModel.classify(imageEl.current);
        console.log("Predictions: ", predictions);

        /** Checking for NSFW */
        let toContinue = true;
        let imageProcess = predictions.map((p) => {
            if (p?.className === "Porn" && p.probability >= 0.6) {
                console.log(p.probability);
                toContinue = false;
            }
            if (p?.className === "Hentai" && p.probability >= 0.6) {
                console.log(p.probability);
                toContinue = false;
            }
        });

        await Promise.all(imageProcess);
        if (!toContinue) {
            setError("Image contains NSFW content. Please reupload new image.");
            return;
        }

        const res = await axios.post("/challenger/api/user/image-upload", {
            data: imageSrc,
        });
        // console.log(res);
        if (!res?.data?.secure_url) {
            //set error here to prevent continueing
            console.error("Image is not cached");
            return;
        }
        /** Submit this quest */
        const { questId, type, rewardTypeId, quantity, extendedQuestData } = submissionQuest;

        let submission = {
            questId,
            type,
            rewardTypeId,
            quantity,
            imageUrl: res?.data?.secure_url,
            extendedQuestData,
        };
        let submittedQuest = await onSubmitImageQuest(submission, userQuests);
        // console.log(submittedQuest);

        if (!submittedQuest.data.isError) {
            setSubmittedQuest(submittedQuest);
            setView(SUBMITTED);
        } else {
            setError(submittedQuest.data.message);
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
                        {submissionQuest && !isSubmitting && !isFetchingUserQuests && (
                            <>
                                {currentView === UPLOADABLE && (
                                    <>
                                        <div className={s.board_title}>{submissionQuest.text}</div>

                                        <form
                                            id="image-upload"
                                            method="post"
                                            onChange={handleOnChange}
                                        >
                                            <p className={s.board_imageUpload_wrapper}>
                                                <button
                                                    className={s.board_pinkBtn}
                                                    onClick={handleClick}
                                                >
                                                    <img
                                                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                                        alt="Choose File"
                                                    />
                                                    <div>
                                                        <span>Choose File</span>
                                                    </div>
                                                </button>
                                                <input
                                                    type="file"
                                                    name="file"
                                                    accept="image/jpeg, image/png"
                                                    style={{ display: "none" }}
                                                    ref={hiddenFileInput}
                                                />
                                            </p>
                                        </form>
                                    </>
                                )}
                                {currentView === SUBMITTABLE && (
                                    <>
                                        {!error && (
                                            <span className={s.board_imageUpload_imageName}>
                                                {imageFile.name}
                                            </span>
                                        )}
                                        {error && (
                                            <span className={s.board_imageUpload_imageName}>
                                                {error}
                                            </span>
                                        )}
                                        <img
                                            src={imageSrc}
                                            className={s.board_imageUpload_imagePreview}
                                            ref={imageEl}
                                        />

                                        <div className={s.board_buttonContainer}>
                                            <button
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
                                            </button>
                                            <button
                                                className={s.board_pinkBtn}
                                                onClick={handleOnSubmit}
                                                disabled={
                                                    submissionQuest?.isDone ||
                                                    isSubmitting ||
                                                    isFetchingUserQuests ||
                                                    error
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
                                {currentView === SUBMITTED && (
                                    <>
                                        <div className={s.board_title}>
                                            Thanks for your submission!
                                        </div>
                                        <button
                                            className={s.board_purpleBtn}
                                            onClick={() => {
                                                window.open(
                                                    `https://discord.com/channels/${submittedQuest?.extendedUserQuestData?.discordServer}/${submittedQuest?.extendedUserQuestData?.discordChannel}/${submittedQuest?.extendedUserQuestData?.messageId}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 4.png`}
                                                alt="See In Discord"
                                            />
                                            <div>
                                                <span>See it in Discord</span>
                                            </div>
                                        </button>
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

const firstHOC = withUserImageQuestSubmit(ImageUpload);
export default withUserQuestQuery(firstHOC);
