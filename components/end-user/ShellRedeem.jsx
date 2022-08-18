import React, { useEffect, useState, useContext, useRef } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useDeviceDetect } from "lib/hooks";
import "/node_modules/nes.css/css/nes.css";
import { useUserRewardQuery, useShellRedeemQuery, withShellRedeemRollAll } from "@shared/HOC";
import useShellRedeemSound from "lib/hooks/useShellRedeemSound";
import Typed from "typed.js";

const INITIAL_0 = 0;
const INITIAL_1 = 1;
const INITIAL_2 = 2;
const IDLE = 3;
const STUCK = 4;
const PUNCH = 5;
const SHOW_REMAINING = 6;
const SHOW_REWARD = 7;
const NOT_ENOUGH_SHELL = 10;
const MACHINE_ERROR = 10;

const ShellRedeem = ({ session, isRolling, rolledData, rollError, onRollSubmit }) => {
    const [machineState, setMachineState] = useState(INITIAL_0);
    const [showFooter, setShowFooter] = useState(false);

    const [boxMessage, setBoxMessage] = useState("");

    const { isMobile } = useDeviceDetect();
    const [userRewards, userRewardLoading] = useUserRewardQuery();
    const [rewardAmount, setRewardAmount] = useState(null);
    const [shellRedeemed, shellRedeemedLoading] = useShellRedeemQuery();
    const [currentViewReward, setCurrentViewReward] = useState(-1);
    const [rewardRedeemed, setRewardRedeemed] = useState(null);
    const [audioControl] = useShellRedeemSound();

    // Create reference to store the DOM element containing the animation
    const el = React.useRef(null);
    // Create reference to store the Typed instance itself
    const typed = React.useRef(null);
    let options = {
        typeSpeed: 3,
        showCursor: false,
    };

    const handlePlayAudio = () => {
        if (
            (machineState === INITIAL_0 ||
                machineState === INITIAL_1 ||
                machineState === SHOW_REWARD) &&
            audioControl
        ) {
            console.log("trying to play auidio");
            audioControl.idle.playRepeat(0.45);
            window.removeEventListener("click", handlePlayAudio);
        }
    };

    useEffect(async () => {}, [isMobile]);
    useEffect(async () => {
        // if redeemed is true
        if (shellRedeemed && shellRedeemed.isRedeemed) {
            setShowFooter(false);
            setRewardRedeemed([...shellRedeemed.rewards]);
            setMachineState(SHOW_REWARD);
            setCurrentViewReward(0);
        } else {
            if (!shellRedeemedLoading && !userRewardLoading) {
                setShowFooter(true);
                setMachineState(INITIAL_1);
                setBoxMessage(
                    `Look at this! It looks old and broken, but it still works…sort of. You can’t choose which treasure you’ll get, so it’s a surprise!`
                );
            }
        }
    }, [shellRedeemed]);
    useEffect(async () => {
        if (
            (machineState === INITIAL_0 ||
                machineState === INITIAL_1 ||
                machineState === SHOW_REWARD) &&
            audioControl &&
            audioControl.idle
        ) {
            window.addEventListener("click", handlePlayAudio);
        }
    }, [audioControl]);

    useEffect(async () => {
        return () => {
            // to prevent memory leaks
            typed.current.destroy();
        };
    }, []);

    useEffect(async () => {
        options.strings = [boxMessage];
        typed.current?.destroy();
        if (el && el.current) {
            typed.current = new Typed(el.current, options);
        }
        typed.current?.start();
    }, [boxMessage, showFooter]);

    useEffect(async () => {
        if (userRewards && userRewards.length > 0) {
            let shellReward = userRewards.find(
                (r) =>
                    r.rewardType.reward.match("hell") ||
                    r.rewardType.reward.match("$Shell") ||
                    r.rewardType.reward.match("$SHELL")
            );
            if (shellReward?.quantity && shellReward.quantity > 0)
                setRewardAmount(shellReward.quantity);
        }
    }, [userRewards]);

    const getRewardText = () => {
        switch (rewardRedeemed[currentViewReward]) {
            case Enums.MINT_LIST_SPOT:
            case Enums.FREE_MINT:
                return (
                    <div className={`${s.redemption_reward_text} ${s.redemption_reward_pinkText}`}>
                        {rewardRedeemed &&
                            rewardRedeemed.length > 0 &&
                            rewardRedeemed[currentViewReward].toString().toUpperCase()}
                    </div>
                );
            default:
                return (
                    <div className={s.redemption_reward_text}>
                        {rewardRedeemed &&
                            rewardRedeemed.length > 0 &&
                            rewardRedeemed[currentViewReward]}
                    </div>
                );
        }
    };
    const viewNextReward = () => {
        if (currentViewReward === rewardRedeemed?.length - 1) {
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
    const handleOnInteraction = () => {
        if (machineState === INITIAL_1) {
            setBoxMessage(
                `I got a bunch’a loot…but I had to use all of my $SHELL at once - that’s the only way it worked for me.`
            );
            setMachineState(INITIAL_2);
        }
        if (machineState === INITIAL_2) {
            setShowFooter(false);
            setMachineState(IDLE);
        }
        if (machineState === MACHINE_ERROR) {
            setShowFooter(false);
            setMachineState(IDLE);
        }
        if (machineState === NOT_ENOUGH_SHELL) {
            setShowFooter(false);
            setMachineState(IDLE);
        }
        if (machineState === STUCK) {
            handleStuckToPunch();
        }
    };

    const handleStuckToPunch = () => {
        if (machineState !== STUCK || !showFooter) {
            // console.log("Not In Stuck");
            return;
        }
        setShowFooter(false);

        let punchTimeout = setTimeout(async () => {
            // console.log("Stuck to Punch");
            setMachineState(PUNCH);
            audioControl.punch.play(0.15);
            clearTimeout(punchTimeout);

            // submit roll here
            let submitRoll = await onRollSubmit();

            if (submitRoll?.data.rewards) {
                setRewardRedeemed([...submitRoll.data.rewards]);

                let showRemainingTimeOut = setTimeout(() => {
                    setMachineState(SHOW_REMAINING);
                    audioControl.reward.play(0.25);
                    clearTimeout(showRemainingTimeOut);

                    let rewardTimeout = setTimeout(() => {
                        setCurrentViewReward(0);
                        setMachineState(SHOW_REWARD);

                        clearTimeout(rewardTimeout);
                    }, 1500);
                }, 1200);
            }
        }, 100);
    };
    const handleRollAll = () => {
        if (rewardAmount < Enums.SHELL_PRICE) {
            setMachineState(NOT_ENOUGH_SHELL);
            setShowFooter(true);
            setBoxMessage("Uhhh .... Oh.... You need more shell to feed meeeeeeeeeeeee!!!!!");
            return;
        }
        // pop up confirm here

        // get machine to stuck
        audioControl.stuck.play(0.25);
        setMachineState(STUCK);

        let footerTimeout = setTimeout(() => {
            setBoxMessage(
                "Oh man! It still gets jammed now and again - Try hitting it a couple of times to see if that works!"
            );
            setShowFooter(true);
            clearTimeout(footerTimeout);
        }, 2500);
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
                {(machineState === INITIAL_0 || shellRedeemedLoading || userRewardLoading) && (
                    <div className={s.redemption_loading}>Loading</div>
                )}
                {machineState !== INITIAL_0 &&
                    machineState !== SHOW_REWARD &&
                    !shellRedeemedLoading &&
                    !userRewardLoading && (
                        <div className={s.redemption_machine}>
                            <div
                                className={`${getMachineBackground(machineState)} ${
                                    s.redemption_machine_container
                                }  `}
                            >
                                <div className={s.redemption_machine_wrapper}>
                                    <div
                                        className={s.redemption_machine_content}
                                        onClick={() => {
                                            handleOnInteraction();
                                        }}
                                    >
                                        {machineState !== PUNCH &&
                                            machineState !== SHOW_REMAINING && (
                                                <div className={s.redemption_machine_shell}>
                                                    $SHELL {rewardAmount}
                                                </div>
                                            )}
                                        {machineState === SHOW_REMAINING && (
                                            <div className={s.redemption_machine_shell}>
                                                $SHELL 0
                                            </div>
                                        )}
                                        <button
                                            disabled={machineState !== IDLE}
                                            className={s.redemption_machine_roll}
                                            onClick={() => handleRollAll()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                {machineState !== INITIAL_0 &&
                    machineState === SHOW_REWARD &&
                    !shellRedeemedLoading &&
                    !userRewardLoading && (
                        <div className={s.redemption_reward}>
                            <div className={s.redemption_reward_container}>
                                <div className={s.redemption_reward_wrapper}>
                                    <div className={s.redemption_reward_content}>
                                        <div className={s.redemption_reward_description}>
                                            Your hard work has paid off, noble Anomura. Now go
                                            forth! claim your treasures, spread the word, and return
                                            when you’ve acquired more $SHELL.
                                        </div>
                                        <div className={s.redemption_reward_scroll}>
                                            <div className={s.redemption_reward_scroll_left}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_left_wrapper
                                                    }
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
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_img_wrapper
                                                    }
                                                >
                                                    <img
                                                        className={
                                                            s.redemption_reward_scroll_img_star
                                                        }
                                                        src={`${Enums.BASEPATH}/img/redemption/Star Background_3x.gif`}
                                                    />
                                                    <div
                                                        className={
                                                            s.redemption_reward_scroll_img_asset
                                                        }
                                                    >
                                                        <img
                                                            src={`${getRewardPicture(
                                                                rewardRedeemed[currentViewReward]
                                                            )} `}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={s.redemption_reward_scroll_right}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_right_wrapper
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            currentViewReward ===
                                                            rewardRedeemed?.length - 1
                                                                ? `${Enums.BASEPATH}/img/redemption/Arrow Right_Gray.png`
                                                                : `${Enums.BASEPATH}/img/redemption/Arrow Right_Blue.png`
                                                        }
                                                        onClick={() => viewNextReward()}
                                                        alt="right arrow"
                                                        className={
                                                            currentViewReward ===
                                                            rewardRedeemed?.length - 1
                                                                ? s.redemption_reward_scroll_left_disable
                                                                : s.redemption_reward_scroll_left_enable
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {getRewardText()}
                                        <div className={s.redemption_reward_buttons}>
                                            <button className={s.redemption_reward_buttons_claim}>
                                                <img
                                                    src={`${Enums.BASEPATH}/img/redemption/Button_M_Pink.png`}
                                                    alt="Claim"
                                                />
                                                <div>
                                                    <span>Claim</span>
                                                </div>
                                            </button>
                                            <button className={s.redemption_reward_buttons_share}>
                                                <img
                                                    src={`${Enums.BASEPATH}/img/redemption/Button_M_Blue.png`}
                                                    alt="Share"
                                                />
                                                <div>
                                                    <span>Share</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <div className={s.redemption_bubble}>
                    <div className={s.redemption_bubble_wrapper}>
                        <img src="/challenger/img/redemption/machine_bubbles_x4.gif" />
                    </div>
                </div>
                {showFooter && (
                    <div className={s.redemption_footer}>
                        <div className={s.redemption_footer_wrapper}>
                            <div
                                className={s.redemption_footer_boxes}
                                onClick={() => {
                                    handleOnInteraction();
                                }}
                            >
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
                                {/* <img
                                    src={`${Enums.BASEPATH}/img/redemption/teal_box.png`}
                                    alt="box"
                                /> */}
                                {/* <div>{boxMessage && <span >{boxMessage}</span>}</div> */}
                                <div>
                                    <span ref={el} />
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
                )}
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/machine_stuck_x4.gif`}
                />
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/machine_punch_x4.gif`}
                />
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/teal_box.png`}
                />
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/dialogue_box_center_x4.png`}
                />
            </>
        );
    }
};

export default withShellRedeemRollAll(ShellRedeem);

const getRewardPicture = (reward) => {
    switch (reward) {
        case Enums.ONE_TO_ONE:
            return `${Enums.BASEPATH}/img/redemption/rewards/one_to_one Call_7x.png`;
        case Enums.ADOPT_ANIMAL:
            return `${Enums.BASEPATH}/img/redemption/rewards/Adopt Animal_7x.png`;
        case Enums.MINT_LIST_SPOT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Mint List_7x.gif`;
        case Enums.EARLY_ACCESS:
            return `${Enums.BASEPATH}/img/redemption/rewards/Early Access V1_7x.png`;
        case Enums.FREE_MINT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Free Mint v2_7x.gif`;
        case Enums.GIFT_MINT_LIST_SPOT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Gift to Fren_7x.png`;
        case Enums.NAME_INGAME:
            return `${Enums.BASEPATH}/img/redemption/rewards/Name character_7x.png`;
        case Enums.ANOMURA_PFP:
            return `${Enums.BASEPATH}/img/redemption/rewards/PFP_7x.png`;
        case Enums.ANOMURA_STICKER:
            return `${Enums.BASEPATH}/img/redemption/rewards/Stickers_7x.png`;
        case Enums.ANOMURA_DOWNLOADABLE_STUFFS:
            return `${Enums.BASEPATH}/img/redemption/rewards/Wallpaper_7x.png`;
        case Enums.OCTOHEDZ_VX_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Octohead_7x.png`;
        case Enums.OCTOHEDZ_RELOADED:
            return `${Enums.BASEPATH}/img/redemption/rewards/Octohead_7x.png`;
        case Enums.COLORMONSTER_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/ColorMonsters_7x.png`;
        case Enums.MIRAKAI_SCROLLS_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Miraikai Scrolls_7x.png`;
        case Enums.ALLSTARZ_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/AllStarz_7x.png`;
        case Enums.ETHER_JUMP_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Etherjump_7x.png`;
        case Enums.META_HERO_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/MetaHero_7x.png`;
        case Enums.EX_8102_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/8102_7x.png`;
        default:
            return `${Enums.BASEPATH}/img/redemption/Bowl new colors.gif`;
    }
};
const getMachineBackground = (state) => {
    switch (state) {
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
