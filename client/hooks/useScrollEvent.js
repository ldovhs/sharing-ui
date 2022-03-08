import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { ScrollValue } from '/atoms/Atoms';


export function useScrollEvent() {

    const setScrollPercent = useSetRecoilState(ScrollValue);

    const updateScroll = () => {
        var pctScrolled = Math.floor(window.scrollY / document.body.clientHeight * 100)
        setScrollPercent(pctScrolled);
    };

    useEffect(() => {
        window.addEventListener("scroll", updateScroll);
        window.addEventListener("resize", updateScroll);
        return () => {
            window.removeEventListener("scroll", updateScroll);
            window.removeEventListener("resize", updateScroll);
        }
    }, );
    return setScrollPercent;
}