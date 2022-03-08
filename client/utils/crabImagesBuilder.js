import { getBody, getClaws, getShell, getLegs, getBackground, getHeadPieces } from "utils/crabData";
import fs from "fs";
import path from "path";
const tools = require("simple-svg-tools");
const sharp = require("sharp");
let FormData = require("form-data")

const SVG_PREFIXTAG = `<?xml version="1.0" encoding="UTF-8" ?>
<svg version="1.1" width="384" height="384" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">`;

export const CrabImagesBuilder = async (crab) => {
    const { crabId, background, body, legs, claws, shell, headpieces } = crab;
    const dirRelativeToPublicFolder = "img/imageviewer";
    const imageDir = path.resolve("./public", dirRelativeToPublicFolder);
    const url = "https://api.cloudinary.com/v1_1/worldwatch/image/upload";

    let backgroundName = getBackground(background);
    let shellName = getShell(shell);
    let legsName = getLegs(legs);
    let bodyName = getBody(body);
    let clawsName = getClaws(claws);
    let headpiecesName = getHeadPieces(headpieces);

    // let backgroundLayer = await loadImage(
    //     path.resolve(`${imageDir}/Background/${backgroundName}_1.svg`)
    // );
    // let shellLayer = await loadImage(path.resolve(`${imageDir}/Shell/${shellName}_1.svg`));
    // let legsLayer = await loadImage(path.resolve(`${imageDir}/Legs/${legsName}_1.svg`));
    // let bodyLayer = await loadImage(path.resolve(`${imageDir}/Body/${bodyName}_1.svg`));
    // let clawsLayer = await loadImage(path.resolve(`${imageDir}/Claws/${clawsName}_1.svg`));
    // let headpiecesLayer = await loadImage(
    //     path.resolve(`${imageDir}/HeadPieces/${headpiecesName}_1.svg`)
    // );

    let backgroundLayer = await loadImage(
        path.resolve(`${imageDir}/Background/${backgroundName}_1.svg`)
    );
    let shellLayer = await loadImage(path.resolve(`${imageDir}/Shell/${shellName}_1.svg`));
    let legsLayer = await loadImage(path.resolve(`${imageDir}/Legs/${legsName}_1.svg`));
    let bodyLayer = await loadImage(path.resolve(`${imageDir}/Body/${bodyName}_1.svg`));
    let clawsLayer = await loadImage(path.resolve(`${imageDir}/Claws/${clawsName}_1.svg`));
    let headpiecesLayer = await loadImage(
        path.resolve(`${imageDir}/HeadPieces/${headpiecesName}_1.svg`)
    );

    let shadowLayer = await loadImage(path.resolve(`${imageDir}/Services/shadow_1.svg`));

    let combineLayer =
        SVG_PREFIXTAG +
        backgroundLayer +
        shadowLayer +
        shellLayer +
        headpiecesLayer +
        legsLayer +
        bodyLayer +
        clawsLayer +
        "</svg>";

    //let base64fromSVG = `data:image/svg+xml;base64,` + Buffer.from(combineLayer).toString("base64");

    const pngBuffer = await sharp(Buffer.from(combineLayer)).png().toBuffer();

    let base64png = `data:image/png;base64,` + Buffer.from(pngBuffer).toString("base64");

    const fileName = `Anomura_${crabId}`;
    const formData = new FormData();
    formData.append("file", base64png);
    formData.append("api_key", "558526949884865");
    formData.append("api_secret", "0Yp8Ix2TWtf3x-3vRoNpXfmcHfY");
    formData.append("upload_preset", "worldwatch");
    formData.append("encoding", "dataURL");
    formData.append("public_id", fileName);

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    let responseData = await response.text();
    let result = await JSON.parse(responseData);
 
    return result.url;
    // return result.secure_url;
};

const loadImage = async (pathToSvg) => {
    let crabImg = await tools.ImportSVG(pathToSvg);
    return crabImg.getBody();
};

const fileExists = async (path) => !!(await fs.promises.stat(path).catch((e) => false));
