import React, { useEffect } from "react";
import s from "/sass/imageviewer/imageviewer.module.css";

export default function CrabViewModal({ data, setModalOpen }) {
    const { background, body, claws, legs, shell, headpieces } = data;
    const [hoverInfo, setHoverInfo] = React.useState({ name: "", src: "", color: null });
    const [rarity, setRarity] = React.useState({
        bodyR: null,
        shellR: null,
        legsR: null,
        clawsR: null,
        headpiecesR: null,
    });

    React.useLayoutEffect(() => {
        let bodyR = GetCardRarity(body);
        let shellR = GetCardRarity(shell);
        let legsR = GetCardRarity(legs);
        let clawsR = GetCardRarity(claws);
        let headpiecesR = GetCardRarity(headpieces);

        setRarity((prevState) => ({
            ...prevState,
            bodyR,
            shellR,
            legsR,
            clawsR,
            headpiecesR,
        }));
    }, []);

    const ShowCard = (e) => {
        let cardRarity = null,
            cardImg = null,
            cardName = "";

        switch (e.target.id) {
            case "shell":
                cardRarity = GetCardRarity(shell);
                cardName = shell;
                break;
            case "legs":
                cardRarity = GetCardRarity(legs);
                cardName = legs;
                break;
            case "body":
                cardRarity = GetCardRarity(body);
                cardName = body;
                break;
            case "claws":
                cardRarity = GetCardRarity(claws);
                cardName = claws;
                break;
            case "headpieces":
                console.log(headpieces);
                cardRarity = GetCardRarity(headpieces);
                cardName = headpieces;
                break;
            default:
                throw new Error("not a valid part");
        }

        cardImg = GetCardImage(cardRarity);

        setHoverInfo({
            name: "place holder",
            src: cardImg,
            nameColor: "place holder text-red-500", // for info on the card
        });
    };

    const HideCard = () => {
        setHoverInfo({
            name: "",
            src: "",
            nameColor: "",
        });
    };

    const GetCardRarity = (name) => {
        let containLegendAttr = legendAttrs.some((el) => name.includes(el));
        if (containLegendAttr) {
            return Legend;
        }

        let containRareAttr =
            prefixAttrs.some((el) => name.includes(el)) &&
            suffixAttrs.some((el) => name.includes(el));
        if (containRareAttr) {
            return Rare;
        }

        let containMagicAttr =
            prefixAttrs.some((el) => name.includes(el)) ||
            suffixAttrs.some((el) => name.includes(el));

        if (containMagicAttr) {
            return Magic;
        }

        return Normal;
    };

    const GetCardImage = (rarity) => {
        switch (rarity) {
            case Legend:
                return "/./img/imageviewer/Others/legend_clean.png";
            case Rare:
                return "/./img/imageviewer/Others/rare_all.png";
            case Magic:
                return "/./img/imageviewer/Others/magic_all.png";
            case Normal:
                return "/./img/imageviewer/Others/normal_all.png";
            default:
                throw new Error("Unsupported type of rarity");
        }
    };

    const GetRarityTextColor = (rarity) => {
        if (rarity == null || rarity == "") {
            return "";
        }
        switch (rarity) {
            case Legend:
                return "text-yellow-500";
            case Rare:
                return "text-blue-500";
            case Magic:
                return "text-teal-400";
            case Normal:
                return "text-white";
            default:
                console.error(rarity);
            //throw new Error("Unsupported type of rarity");
        }
    };

    const GetProperBackgroundName = (name) => {
        let bgArray = name.split("_");
        let first = capitalizeFirstLetter(bgArray[0]);
        let last = capitalizeFirstLetter(bgArray[1]);
        return first + " " + last;
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <>
            <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center pointer-events-none">
                <div className={s.modal_container}>
                    <div className={s.component_zone}>
                        <div className={s.component_list}>
                            <div className={s.component_list_item}>
                                <div className={s.component_list_item_icon}>
                                    <img
                                        id="body"
                                        className={s.component_list_item_icon_img}
                                        src="/img/imageviewer/Others/body.png"
                                        onMouseEnter={ShowCard}
                                        onMouseLeave={HideCard}
                                    />
                                </div>
                                <div
                                    className={`${
                                        s.component_list_item_description
                                    } ${GetRarityTextColor(rarity.bodyR)} font-extrabold`}
                                >
                                    <span>{rarity.bodyR?.description}</span>
                                    <span className="ml-2">Body</span>
                                </div>
                            </div>
                            <div className={s.component_list_item}>
                                <div className={s.component_list_item_icon}>
                                    <img
                                        id="shell"
                                        className={s.component_list_item_icon_img}
                                        src="/img/imageviewer/Others/shell.png"
                                        onMouseEnter={ShowCard}
                                        onMouseLeave={HideCard}
                                    />
                                </div>
                                <div
                                    className={`${
                                        s.component_list_item_description
                                    } ${GetRarityTextColor(rarity.shellR)} font-extrabold`}
                                >
                                    <span>{rarity.shellR?.description}</span>
                                    <span className="ml-2">Shell</span>
                                </div>
                            </div>
                            <div className={s.component_list_item}>
                                <div className={s.component_list_item_icon}>
                                    <img
                                        id="legs"
                                        className={s.component_list_item_icon_img}
                                        src="/img/imageviewer/Others/legs.png"
                                        onMouseEnter={ShowCard}
                                        onMouseLeave={HideCard}
                                    />
                                </div>
                                <div
                                    className={`${
                                        s.component_list_item_description
                                    } ${GetRarityTextColor(rarity.legsR)} font-extrabold`}
                                >
                                    <span>{rarity.legsR?.description}</span>
                                    <span className="ml-2">Legs</span>
                                </div>
                            </div>
                            <div className={s.component_list_item}>
                                <div className={s.component_list_item_icon}>
                                    <img
                                        id="claws"
                                        className={s.component_list_item_icon_img}
                                        src="/img/imageviewer/Others/claws.png"
                                        onMouseEnter={ShowCard}
                                        onMouseLeave={HideCard}
                                    />
                                </div>
                                <div
                                    className={`${
                                        s.component_list_item_description
                                    } ${GetRarityTextColor(rarity.clawsR)} font-extrabold`}
                                >
                                    <span>{rarity.clawsR?.description}</span>
                                    <span className="ml-2">Claws</span>
                                </div>
                            </div>
                            <div className={s.component_list_item}>
                                <div className={s.component_list_item_icon}>
                                    <img
                                        id="headpieces"
                                        className={s.component_list_item_icon_img}
                                        src="/img/imageviewer/Others/star.png"
                                        onMouseEnter={ShowCard}
                                        onMouseLeave={HideCard}
                                    />
                                </div>
                                <div
                                    className={`${
                                        s.component_list_item_description
                                    } ${GetRarityTextColor(rarity.headpiecesR)} font-extrabold`}
                                >
                                    <span>{rarity.headpiecesR?.description}</span>
                                    <span className="ml-2">Head Pieces</span>
                                </div>
                            </div>
                            {/* background */}
                            <div id="background" className={s.component_list_item}>
                                <div className={s.component_list_item_icon}>
                                    <img
                                        className={s.component_list_item_icon_img}
                                        src="/img/imageviewer/Others/bg.png"
                                    />
                                </div>
                                <div
                                    className={`${s.component_list_item_description} font-extrabold text-white`}
                                >
                                    <span className="">{GetProperBackgroundName(background)}</span>
                                </div>
                            </div>
                            {/*   card    */}
                            <div className={s.component_right}>
                                <img className={s.component_right_card} src={hoverInfo.src} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={s.modal_overlay} onClick={() => setModalOpen(false)} />
            </div>
        </>
    );
}

/** rarity enum **/
const Legend = Symbol("Legend");
const Rare = Symbol("Rare");
const Magic = Symbol("Magic");
const Normal = Symbol("Normal");

const prefixAttrs = ["Indestructible", "Reinforced", "Graceful", "Majestic"];

const suffixAttrs = ["of Gaia", "of Peace", "of Doom", "of Doom", "of Doom", "of the Unworldly"];

const legendAttrs = [
    "The Minotaur",
    "The Atlantean",
    "Djinn's",
    "Undying",
    "Spirit's",
    "Coldsteel",
    "The Leviathan",
    "Serpent's Eye",
    "The Bone Breaker",
    "Guardian's",
    "Sanctuary",
];

const bgPrefixAttrs = ["Secret", "Isolated", "Bountiful", "Treasured"];
