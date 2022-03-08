import React from "react";
import s from "/sass/home/home.module.css";

export default function ShopZone({ audioControl, setAudioControl }) {
    const comingSoonRef = React.createRef();
    const [isSandSignVisible, setSandSignVisible] = React.useState(false);
    const [windowSize, setWindowSize] = React.useState({ width: undefined });

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowSize({
                width: window.innerWidth,
            });
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    setSandSignVisible(true);
                } else {
                    setSandSignVisible(false);
                }
            });
        });

        observer.observe(comingSoonRef.current);

        return () => {
            if (comingSoonRef.current) {
                observer.unobserve(comingSoonRef.current);
            }
        };
    }, []);

    const TurnOffSound = (e) => {
        e.preventDefault();

        if (audioControl.isSoundOn) {
            console.log("turn off sound");

            setAudioControl((prevState) => ({
                ...prevState,
                isSoundOn: false,
            }));
            audioControl.setSound(false);
        } else {
            console.log("turn on sound");

            setAudioControl((prevState) => ({
                ...prevState,
                isSoundOn: true,
            }));
            audioControl.setSound(true);
        }
    };

    const ComingSoonScrollAction = () => {
        if (comingSoonRef.current) {
            comingSoonRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div>
            <div className={`${s.shop_zone}`}>
                <picture>
                    <source
                        srcSet="/img/home/shop.webp"
                        media="(min-width: 1200px)"
                        type="image/webp"
                    />
                    <source srcSet="/img/home/shop.gif" media="(min-width: 800px)" />
                    <img className={s.shop_img} src="/img/home/shop.gif" alt="" />
                </picture>
            </div>
            {/******************* Sand Zone and Coming Soon *****************/}
            <div className={s.sand_zone}>
                <div className={s.sand_zone_sand} />
                <img
                    ref={comingSoonRef}
                    className={`${s.follow_img} `}
                    onClick={() => ComingSoonScrollAction()}
                    onMouseEnter={(e) => {
                        e.currentTarget.src =
                            windowSize.width > 1200
                                ? "/img/home/follow_us/coming_soon_on.webp"
                                : "/img/home/follow_us/coming_soon_on.gif";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.src =
                            windowSize.width > 1200
                                ? "/img/home/follow_us/coming_soon_off.webp"
                                : "/img/home/follow_us/coming_soon_off.gif";
                    }}
                    src={`${
                        windowSize.width > 1200
                            ? "/img/home/follow_us/coming_soon_off.webp"
                            : "/img/home/follow_us/coming_soon_off.gif"
                    }`}
                    alt=""
                />
                <div className={s.follow_text}>
                    <div>
                        {/* <span className={`${s.shop_heading}`}>COMING SOON!</span> */}
                        <p className={s.follow_text_paragraph}>
                            <span className="font-bold">
                                Anomura is a new retro play-to-earn game utilizing NFTs and
                                blockchain technology.
                            </span>
                        </p>
                        <p className={s.follow_text_paragraph}>
                            <span className="font-bold ">
                                Addictive gameplay, beautiful pixel art, contributions to wildlife
                                preservation - this is a game with a greater purpose.
                            </span>
                        </p>
                    </div>
                </div>
                {/* <div ref={followRef} className={s.follow_iconContainer}>
                    <a
                        href="https://twitter.com/anomuragame"
                        target="_blank"
                        className={`${s.follow_iconContainer_twitter}`}
                    />
                    <a
                        href="https://discord.com/anomuragame"
                        target="_blank"
                        className={`${s.follow_iconContainer_discord}`}
                    />
                    <a
                        href="https://instagram.com/anomuragame"
                        target="_blank"
                        className={`${s.follow_iconContainer_instagram}`}
                    />
                    <img
                        className={s.follow_iconContainer_icons}
                        src="/img/home/follow_us/follow_icons_x3.png"
                    />
                </div> */}
            </div>
            {/******************* Sand Fixed Bottom*****************/}
            <div className={`${s.sandBottom_zone} ${isSandSignVisible ? "opacity-100 z-10" : ""}`}>
                <div className={s.sandBottom_left} />
                <div className={`${s.sandBottom_center} `}>
                    <div
                        className={`${s.sandBottom_center_icons} ${
                            isSandSignVisible ? "pointer-events-auto" : "pointer-events-none"
                        } `}
                    >
                        <a
                            href="https://twitter.com/anomuragame"
                            target="_blank"
                            className={`${s.sandBottom_center_icons_twitter}`}
                        />
                        <a
                            href="https://discord.com/anomuragame"
                            target="_blank"
                            className={`${s.sandBottom_center_icons_discord}`}
                        />
                        <a
                            href="https://instagram.com/anomuragame"
                            target="_blank"
                            className={`${s.sandBottom_center_icons_instagram}`}
                        />
                    </div>
                    <img
                        className={s.sandBottom_icons}
                        src="/img/home/bottomSand/bottom_sand_icons_bump_x3.png"
                    />
                </div>
                <div className={s.sandBottom_right}>
                    <div
                        className={`${s.sandBottom_right_container} ${
                            isSandSignVisible ? "pointer-events-auto" : "pointer-events-none"
                        }`}
                    >
                        <a
                            className={`${s.sandBottom_right_container_discord}`}
                            href="https://discord.com/anomuragame"
                            target="_blank"
                        />
                        <a
                            href=""
                            className={`${s.sandBottom_right_container_soundOff}`}
                            onClick={TurnOffSound}
                        />
                        <div></div>
                    </div>
                    <img
                        className={s.sandBottom_image}
                        src={`${
                            audioControl.isSoundOn
                                ? "/img/home/bottomSand/bottom_discord_unmute_sign_x3.png"
                                : "/img/home/bottomSand/bottom_discord_mute_sign_x3.png"
                        }`}
                    />
                </div>
            </div>
        </div>
    );
}
