import React, { useEffect, useState, useContext, useRef } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";
import { useRouter } from "next/router";

import img1 from "/public/img/redemption/machine_idle_x4.gif";
import img2 from "/public/img/redemption/machine_punch_x4.gif";

const IDLE = 1;
const STUCK = 2;
const PUNCH = 3;

const ShellRedeem = ({ session }) => {
    const [machineState, setMachineState] = useState(IDLE);
    const [showBox, setShowBox] = useState(false);

    const handleRollOne = () => {
        let random = Math.floor(Math.random() * (100 + 1));

        if (random >= 50) {
            //punch
            setMachineState(PUNCH);

            let timeout = setTimeout(() => {
                setMachineState(IDLE);
                clearTimeout(timeout);
            }, 2500);
        } else {
            //stuck
            setMachineState(STUCK);

            let timeout = setTimeout(() => {
                setMachineState(IDLE);
                clearTimeout(timeout);
            }, 2500);
        }
    };

    const handleRollAll = () => {};
    useEffect(async () => {
        let arrImgs = [img1, img2];

        const promises = await arrImgs.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve();
                img.onerror = reject();
            });
        });

        await Promise.all(promises);
        console.log("Loaded image");
    }, []);

    useEffect(async () => {
        console.log(machineState);
    }, [machineState]);

    return (
        <>
            <div className={s.redemption_machine}>
                <div
                    className={`${s.redemption_machine_container} ${
                        machineState === PUNCH
                            ? s.redemption_machine_punch
                            : s.redemption_machine_idle
                    } `}
                >
                    <div className={s.redemption_machine_wrapper}>
                        <div className={s.redemption_machine_content}>
                            {machineState !== PUNCH && (
                                <div className={s.redemption_machine_shell}>$SHELL 33333</div>
                            )}
                            <button
                                disabled={machineState === PUNCH}
                                className={s.redemption_machine_roll1}
                                onClick={() => handleRollOne()}
                            />
                            <button
                                disabled={machineState === PUNCH}
                                className={s.redemption_machine_rollAll}
                                onClick={() => handleRollAll()}
                            />
                            <div className={s.redemption_machine_bubble} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={s.redemption_footer}>
                <div className={s.redemption_footer_wrapper}>
                    <div className={s.redemption_footer_boxes}>
                        <img src={`${Enums.BASEPATH}/img/redemption/teal_box.png`} alt="box" />
                        <div>
                            <span>
                                Man, that old wreck keeps jamming every time! Didn't you put any
                                money in it ?!
                            </span>
                            <span>Try to give it a few hits and see if it unlocks!</span>
                        </div>
                    </div>
                    <div className={s.redemption_footer_octopus}>
                        <img
                            src={`${Enums.BASEPATH}/img/redemption/avatar_octo_96x96.gif`}
                            alt="octopus"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShellRedeem;
