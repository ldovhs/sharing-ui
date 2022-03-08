import React, { useState, useEffect } from "react";
import s from "/sass/home/home.module.css";

export default function TreasureChest({ audioControl }) {
    const [chestState, setChestState] = useState("idle");
    const treasureRef = React.createRef();
    const [audioState, setAudioState] = useState("unloaded");

    let timeout, interval;

    useEffect(() => {
        const imgs = [
            "/img/home/chests/chest_opened_175f.gif",
            "/img/home/chests/chest_opening_135f.gif",
        ];
        cacheImages(imgs); // on load page 200ms slower, but reduce laggy on transition chest on mobile

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", changeAudioVolume);

        // if (audioControl.chestChime != null && audioState == "unloaded") {
        //     setAudioState("loaded");
        // }
        return () => {
            window.removeEventListener("scroll", changeAudioVolume);
        };
    }, [treasureRef]);

    useEffect(() => {
        changeAudioVolume();
        if (audioControl.chestChime != null && audioState == "unloaded") {
            setAudioState("loaded");
        }
        return () => {};
    }, [audioControl]);

    const cacheImages = async (arrImgs) => {
        const promises = await arrImgs.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve();
                img.onerror = reject();
            });
        });

        await Promise.all(promises);
    };

    const changeAudioVolume = () => {
        if (treasureRef.current && audioState == "loaded") {
            let rect = treasureRef.current.getBoundingClientRect();
            let reference = Math.abs(rect.top);

            if (chestState !== "opened") {
                let chimeVolume = 0.1 - reference / 8000;
                if (chimeVolume < 0.001 || !audioControl.isSoundOn) {
                    audioControl.chestChime.setVolume(0);
                } else {
                    {
                        audioControl.chestChime.setVolume(chimeVolume);
                    }
                }
            }

            let fishVolume = 1 - reference / 800; // no fish sound around footer
            if (fishVolume < 0.1 || !audioControl.isSoundOn) {
                audioControl.fishPass.setVolume(0);
            } else {
                {
                    audioControl.fishPass.setVolume(fishVolume);
                }
            }
        }
    };

    const OpenChest = async () => {
        if (chestState !== "idle") {
            return;
        }
        if (chestState === "idle") {
            setChestState("opening");
            setTimeout(() => {
                setChestState("opened");
            }, 800);
        }

        //if (audioControl.chestChime) {
        audioControl.chestChime.stop();
        //}

        let volumeVal = !audioControl.isSoundOn ? 0 : 1;

        if (audioControl.chestOpen) {
            audioControl.chestOpen.playSound(volumeVal);
        }

        timeout = setTimeout(() => {
            audioControl.fishPass.playSound(volumeVal);
            interval = setInterval(() => {
                audioControl.fishPass.playSound();
            }, 4400);
        }, 2200);
    };

    const renderCard = () => {
        return (
            <img
                className={`${s.treasure_card} ${chestState === "opened" ? "" : "invisible"}`}
                src="/img/home/cards/Card.webp"
                alt=""
            />
        );
    };

    const renderChest = () => {
        if (chestState === "idle") {
            return (
                <img
                    onClick={OpenChest}
                    className={`${s.treasure_chest}`}
                    src="/img/home/chests/idleChest_175f.gif"
                    alt=""
                />
            );
        }

        if (chestState === "opening") {
            return (
                <img
                    className={`${s.treasure_chest}`}
                    src="/img/home/chests/chest_opening_135f.gif"
                    alt=""
                />
            );
        }

        if (chestState === "opened") {
            return (
                <img
                    className={`${s.treasure_chest}`}
                    src="/img/home/chests/chest_opened_175f.gif"
                    alt=""
                />
            );
        }
    };

    const renderChestFloor = () => {
        return (
            <img
                className={`${s.treasure_chestFloor}`}
                src="/img/home/chests/chestfloor_modified.webp"
                alt=""
            />
        );
    };

    const renderChestLight = () => {
        return (
            <img
                className={`${s.treasure_chestLight}`}
                src={`${
                    chestState === "opened"
                        ? "/img/home/chests/chest_open_lights_modified.webp"
                        : "/img/home/chests/chest_idle_lights_modified.webp"
                }`}
                alt=""
            />
        );
    };

    return (
        <div className={s.treasure_zone} ref={treasureRef}>
            <div className={s.treasure_image}>
                {renderCard()}
                {renderChestFloor()}
                {renderChest()}
                {renderChestLight()}
            </div>
        </div>
    );
}
