import React from "react";
import { useScrollValue } from "/lib/useScrollValue";
import s from "/sass/home/home.module.css";

const InitialOffset = 5000,
    TwelveHundredOffSet = -700,
    OneThousandOffSet = -1250,
    EightHundredOffSet = -1150,
    SixHundredOffSet = -1530,
    FourHundredOffSet = -1850;

export default function Footer({ ScrollPercent }) {
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
        if (window.innerWidth <= 1200) setScrollSpeed(-25);
        if (window.innerWidth <= 600) setScrollSpeed(-22);
    }, []);

    return (
        <div className={s.footer_zone} style={{ top: `calc(${calculatedOffsetY}px)` }}>
            <div className={s.footer_logo}>
                <img src="/img/home/logos/vhs.png" alt="" />
            </div>
            <div className={s.footer_info}>
                <div className={s.footer_social}>
                    <img src="/img/home/logos/linkedin.png" alt="Linkedin" />
                    <img src="/img/home/logos/twitter.png" alt="Twitter" />
                </div>
            </div>
            <div className={s.footer_text}>
                <p>
                    Virtually Human Studio’s mission is to uncover what the future of entertainment
                    can do for humanity. Their flagship game ZED RUN is one of the first of its kind
                    created on the blockchain and is one of the leading NFT games built on Ethereum
                    globally.
                </p>
            </div>
        </div>
    );
}
