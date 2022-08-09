import React, { useEffect, useState, useContext, useRef } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useDeviceDetect } from "lib/hooks";
import { useRouter } from "next/router";
import "/node_modules/nes.css/css/nes.css";

const IDLE = 1;
const STUCK = 2;
const PUNCH = 3;
const SHOWREWARD = 4;

let rewardArray = [
    "Gift a Mintlist Spot to a fren",
    "Free mint",
    "Nothing!",
    "Anomura downloadable wallpaper",
];

const ShellRedeem = ({ session }) => {
    const [machineState, setMachineState] = useState(SHOWREWARD);
    const [showFooter, setShowFooter] = useState(false);
    const [currentViewReward, setCurrentViewReward] = useState(0);
    const [boxMessage, setBoxMessage] =
        useState(`Man, that old wreck keeps jamming every time! Didn't you put any
    money in it ?!\n Try to give it a few hits and see if it unlocks!`);

    const { isMobile } = useDeviceDetect();

    const handleStuckToPunch = () => {
        if (machineState !== STUCK || !showFooter) {
            console.log("Not In Stuck");
            return;
        }
        setShowFooter(false);

        let punchTimeout = setTimeout(() => {
            console.log("Stuck to Punch");
            setMachineState(PUNCH);
            clearTimeout(punchTimeout);

            let rewardTimeout = setTimeout(() => {
                setCurrentViewReward(0);
                setMachineState(SHOWREWARD);
                clearTimeout(rewardTimeout);
            }, 2200);
        }, 100);
    };
    const handleRollOne = () => {
        // get machine to stuck
        setMachineState(STUCK);

        let footerTimeout = setTimeout(() => {
            setShowFooter(true);
            clearTimeout(footerTimeout);
        }, 2500);
    };

    const handleRollAll = () => {};

    useEffect(async () => {
        // let arrImgs = [img1, img2, img3];
        // const promises = await arrImgs.map((img) => {
        //     return new Promise((resolve, reject) => {
        //         const image = new Image();
        //         image.src = img.src;
        //         img.onload = resolve();
        //         img.onerror = reject();
        //     });
        // });
        // await Promise.all(promises);
        // console.log("Loaded image");
    }, [isMobile]);

    const getMachineBackground = () => {
        switch (machineState) {
            case IDLE:
                return s.redemption_machine_idle;
            case PUNCH:
                return s.redemption_machine_punch;
            case STUCK:
                return s.redemption_machine_stuck;
            default:
                return s.redemption_machine_idle;
        }
    };

    const getRewardPicture = () => {
        switch (rewardArray[currentViewReward]) {
            case "Gift a Mintlist Spot to a fren":
                return `${Enums.BASEPATH}/img/redemption/Bowl new colors.gif`;
            case "Free mint":
                return `${Enums.BASEPATH}/img/redemption/Bowl new colors.gif`;
            case "Nothing!":
                return `${Enums.BASEPATH}/img/redemption/Bowl new colors.gif`;
            case "Anomura downloadable wallpaper":
                return `${Enums.BASEPATH}/img/redemption/Bowl new colors.gif`;
            default:
                return "";
        }
    };
    const viewNextReward = () => {
        if (currentViewReward === rewardArray.length - 1) {
            return;
        }
        setCurrentViewReward((prev) => prev + 1);
    };
    const viewPreviousReward = () => {
        if (currentViewReward === 0) {
            return;
        }
        setCurrentViewReward((prev) => prev - 1);
    };

    if (process.env.NEXT_PUBLIC_CAN_REDEEM_SHELL === "false") {
        return (
            <div className={s.redemption_reward}>
                <div className={s.redemption_reward_container}>
                    <div className={s.redemption_reward_title}>404 Error!</div>
                    <div className={s.redemption_reward_wrapper}>
                        <div className={s.redemption_reward_content}>
                            <div className={s.redemption_reward_description}>
                                Placeholder TextLorem ipsum dolor sit amet, consectetur adipiscing
                                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                                aliqua. Ut enim ad minim veniam, quis nostru.
                            </div>

                            <div className={s.redemption_reward_text}>Nothing Here...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <>
                {machineState !== SHOWREWARD && (
                    <div className={s.redemption_machine}>
                        <div
                            className={`${
                                s.redemption_machine_container
                            } ${getMachineBackground()} `}
                        >
                            <div className={s.redemption_machine_wrapper}>
                                <div
                                    className={s.redemption_machine_content}
                                    onClick={() => handleStuckToPunch()}
                                >
                                    {machineState !== PUNCH && (
                                        <div className={s.redemption_machine_shell}>
                                            $SHELL 33333
                                        </div>
                                    )}
                                    <button
                                        disabled={machineState !== IDLE}
                                        className={s.redemption_machine_roll1}
                                        onClick={() => handleRollOne()}
                                    />
                                    <button
                                        disabled={machineState !== IDLE}
                                        className={s.redemption_machine_rollAll}
                                        onClick={() => handleRollAll()}
                                    />
                                    <div className={s.redemption_machine_bubble}>
                                        <div className={s.redemption_machine_bubble_wrapper}>
                                            <img src="/challenger/img/redemption/machine_bubbles_x4.gif" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {machineState === SHOWREWARD && (
                    <div className={s.redemption_reward}>
                        <div className={s.redemption_reward_container}>
                            <div className={s.redemption_reward_title}>YOU WON!</div>
                            <div className={s.redemption_reward_wrapper}>
                                <div className={s.redemption_reward_content}>
                                    <div className={s.redemption_reward_description}>
                                        Placeholder TextLorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                        et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostru.
                                    </div>
                                    <div className={s.redemption_reward_scroll}>
                                        <div className={s.redemption_reward_scroll_left}>
                                            <div
                                                className={s.redemption_reward_scroll_left_wrapper}
                                            >
                                                <img
                                                    src={
                                                        currentViewReward === 0
                                                            ? `${Enums.BASEPATH}/img/redemption/Arrow Left_Gray.png`
                                                            : `${Enums.BASEPATH}/img/redemption/Arrow Left_Blue.png`
                                                    }
                                                    alt="left arrow"
                                                    onClick={() => viewPreviousReward()}
                                                    className={
                                                        currentViewReward === 0
                                                            ? s.redemption_reward_scroll_left_disable
                                                            : s.redemption_reward_scroll_left_enable
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className={s.redemption_reward_scroll_img}>
                                            <div className={s.redemption_reward_scroll_img_wrapper}>
                                                <img src={`${getRewardPicture()} `} />
                                            </div>
                                        </div>
                                        <div className={s.redemption_reward_scroll_right}>
                                            <div
                                                className={s.redemption_reward_scroll_right_wrapper}
                                            >
                                                <img
                                                    src={
                                                        currentViewReward === rewardArray.length - 1
                                                            ? `${Enums.BASEPATH}/img/redemption/Arrow Right_Gray.png`
                                                            : `${Enums.BASEPATH}/img/redemption/Arrow Right_Blue.png`
                                                    }
                                                    onClick={() => viewNextReward()}
                                                    alt="right arrow"
                                                    className={
                                                        currentViewReward === rewardArray.length - 1
                                                            ? s.redemption_reward_scroll_left_disable
                                                            : s.redemption_reward_scroll_left_enable
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={s.redemption_reward_text}>
                                        {rewardArray[currentViewReward]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showFooter && (
                    <div className={s.redemption_footer}>
                        <div className={s.redemption_footer_wrapper}>
                            <div className={s.redemption_footer_boxes}>
                                {isMobile ? (
                                    <img
                                        src={`${Enums.BASEPATH}/img/redemption/dialogue_box_center_x4.png`}
                                        alt="box"
                                    />
                                ) : (
                                    <img
                                        src={`${Enums.BASEPATH}/img/redemption/teal_box.png`}
                                        alt="box"
                                    />
                                )}
                                <div>{boxMessage && <span>{boxMessage}</span>}</div>
                            </div>
                            <div className={s.redemption_footer_octopus}>
                                <img
                                    src={`${Enums.BASEPATH}/img/redemption/avatar_octo_96x96.gif`}
                                    alt="octopus"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <img
                    style={{ display: "none" }}
                    src="/challenger/img/redemption/machine_stuck_x4.gif"
                />
                <img
                    style={{ display: "none" }}
                    src="/challenger/img/redemption/machine_punch_x4.gif"
                />
            </>
        );
    }
};

export default ShellRedeem;
