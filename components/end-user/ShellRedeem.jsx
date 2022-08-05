import React, { useEffect, useState, useContext, useRef } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useDeviceDetect } from "lib/hooks";
import { useRouter } from "next/router";

import img1 from "/public/img/redemption/machine_idle_x4.gif";
import img2 from "/public/img/redemption/machine_punch_x4.gif";
import img3 from "/public/img/redemption/machine_stuck_x4.gif";
const IDLE = 1;
const STUCK = 2;
const PUNCH = 3;

const ShellRedeem = ({ session }) => {
    const [machineState, setMachineState] = useState(IDLE);
    const [showFooter, setShowFooter] = useState(true);
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

            let idleTimeout = setTimeout(() => {
                setMachineState(IDLE);
                clearTimeout(idleTimeout);
            }, 2200);
        }, 100);
    };
    const handleRollOne = () => {
        // get machine to stuck

        setMachineState(STUCK);

        let footerTimeout = setTimeout(() => {
            setShowFooter(true);
            clearTimeout(footerTimeout);

            // let stuckTimeout = setTimeout(() => {
            //     setShowFooter(false);
            //     setBoxMessge(`Man, that old wreck keeps jamming every time! Didn't you put any
            //     money in it ?!

            //     Try to give it a few hits and see if it unlocks!`);
            //     setMachineState(IDLE);
            //     clearTimeout(stuckTimeout);
            // }, 2200);
        }, 2500);

        // if (random >= 50) {
        //     //punch
        //     console.log("in punch");
        //     setMachineState(PUNCH);

        //     let timeout = setTimeout(() => {
        //         setMachineState(IDLE);
        //         clearTimeout(timeout);
        //     }, 2500);
        // } else {
        //     //stuck
        //     console.log("in stuck");
        //     setMachineState(STUCK);

        //     let footerTimeout = setTimeout(() => {
        //         setShowFooter(true);
        //         clearTimeout(footerTimeout);

        //         let stuckTimeout = setTimeout(() => {
        //             setShowFooter(false);
        //             setBoxMessge(`Man, that old wreck keeps jamming every time! Didn't you put any
        //             money in it ?!

        //             Try to give it a few hits and see if it unlocks!`);
        //             setMachineState(IDLE);
        //             clearTimeout(stuckTimeout);
        //         }, 2200);
        //     }, 2500);
        // }
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

    // useEffect(async () => {

    // }, [machineState]);

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

    return (
        <>
            <div className={s.redemption_machine}>
                <div className={`${s.redemption_machine_container} ${getMachineBackground()} `}>
                    <div className={s.redemption_machine_wrapper}>
                        <div
                            className={s.redemption_machine_content}
                            onClick={() => handleStuckToPunch()}
                        >
                            {machineState !== PUNCH && (
                                <div className={s.redemption_machine_shell}>$SHELL 33333</div>
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
};

export default ShellRedeem;
