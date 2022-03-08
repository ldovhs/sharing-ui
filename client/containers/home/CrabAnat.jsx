import React from "react";
import { useScrollValue } from "/lib/useScrollValue";
import s from "/sass/home/home.module.css";

const InitialOffset = 1850,
    TwelveHundredOffSet = -200,
    OneThousandOffSet = -400,
    EightHundredOffSet = -250,
    SixHundredOffSet = -640,
    FourHundredOffSet = -750;

export default function CrabAnat({ ScrollPercent }) {
    const [scrollSpeed, setScrollSpeed] = React.useState(-25);
    const [showBubble, setshowBubble] = React.useState(false);
    let timeout;

    let calculatedOffsetY = useScrollValue(
        ScrollPercent,
        scrollSpeed,
        InitialOffset,
        TwelveHundredOffSet,
        OneThousandOffSet,
        EightHundredOffSet,
        SixHundredOffSet,
        FourHundredOffSet
    );

    React.useLayoutEffect(() => {
        if (window.innerWidth <= 1200) setScrollSpeed(-14);
        if (window.innerWidth <= 600) setScrollSpeed(-9);
    }, []);

    React.useEffect(() => {
        timeout = setTimeout(() => {
            setshowBubble(true);
        }, 3000);
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className={s.crab_anat} style={{ top: `calc(${calculatedOffsetY}px)` }}>
            <div className={s.crab_text}>
                <div>
                    <span className={s.crab_normal}>CRAB ANATOMY!</span>
                    <div className={s.crab_inline}>
                        Each body part has a chance of being normal to legendary in rarity.
                    </div>
                </div>
                <br />

                <div className={s.crab_rarityContainer}>
                    <img
                        className={`${s.crab_bubble1}  `}
                        src="/img/home/bubbles_animated-export.gif"
                    />
                    {showBubble && (
                        <img
                            className={s.crab_bubble2}
                            src="/img/home/bubbles_animated-export2.gif"
                        />
                    )}
                    <div className={s.crab_rarityBlock}>
                        <div>
                            <span className={s.crab_magical}>Magical Item</span>
                        </div>

                        <div className={s.crab_inline}>
                            11% - 1 Magical Prefix
                            <br />
                            11% - 1 Magical Suffix
                            <br />
                            ~22% chance of a magic item
                        </div>
                    </div>
                    <div className={s.crab_rarityBlock}>
                        <div>
                            <span className={s.crab_rare}>Rare Item</span>
                        </div>
                        <div className={s.crab_inline}>
                            11% - Magical Prefix <br />
                            11% - Magical Suffix
                        </div>
                    </div>
                    <div className={s.crab_rarityBlock}>
                        <div>
                            <span className={s.crab_legend}>Legendary Item</span>
                        </div>
                        <div className={s.crab_inline}>~2% - Legendary Item Prefix</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
