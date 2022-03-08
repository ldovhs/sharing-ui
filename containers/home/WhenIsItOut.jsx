import React from "react";
import { useScrollValue } from "/lib/useScrollValue";
import { TreasureChest } from "/containers/home/ContainerIndex";
import s from "/sass/home/home.module.css";

const InitialOffset = 3500,
    TwelveHundredOffSet = -800,
    OneThousandOffSet = -1100,
    EightHundredOffSet = -850,
    SixHundredOffSet = -1530,
    FourHundredOffSet = -1300;

export default function WhenIsItOut({ ScrollPercent, audioControl }) {
    const [scrollSpeed, setScrollSpeed] = React.useState(-55);
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
        if (window.innerWidth <= 1200) setScrollSpeed(-20);
        if (window.innerWidth <= 600) setScrollSpeed(-18);
    }, []);

    return (
        <div className={s.when_zone} style={{ top: `calc(${calculatedOffsetY}px)` }}>
            <div className={s.when_text}>
                <div>
                    <span className={s.when_highlight}>WHEN IS IT OUT?</span>
                </div>
                <p className={s.when_paragraph}>
                    Anomura is targeted to be released by the end of 2021, <br />
                    with many alpha and beta releases. <br />A detailed road map will be available
                    shortly!
                </p>
            </div>
            <TreasureChest audioControl={audioControl}></TreasureChest>
        </div>
    );
}
