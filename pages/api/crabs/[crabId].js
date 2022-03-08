import { getCrabById, createCrab, updateCrabById } from "repositories/crabs";
import { CrabImagesBuilder } from "utils/crabImagesBuilder";
export default async function crabImageViewerHandler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                let id = parseInt(req.query.crabId);
                let crab = await getCrabById(id);

                if (crab) {
                    res.status(200).json({
                        name: `Crab ${crab.crabId}`,
                        description: "Crab test",
                        animation_url: `${process.env.WEBSITE_HOST}/imageviewer/${crab.crabId}`,
                        //image: `${process.env.WEBSITE_HOST}/img/imageviewer/${crab.image}`,
                        image: crab.image,
                        attributes: [
                            {
                                trait_type: "Background",
                                value: crab.background,
                            },
                            {
                                trait_type: "Body",
                                value: crab.body,
                            },
                            {
                                trait_type: "Claws",
                                value: crab.claws,
                            },
                            {
                                trait_type: "Legs",
                                value: crab.legs,
                            },
                            {
                                trait_type: "Shell",
                                value: crab.shell,
                            },
                            {
                                trait_type: "Head Pieces",
                                value: crab.headpieces,
                            },
                        ],
                    });
                } else {
                    res.status(200).json({
                        name: `Crab ${id}`,
                        description: "Unminted crab",
                    });
                }
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }

            break;
        case "POST":
            try {
                const {
                    data: { background, body, legs, claws, shell, headpieces },
                } = req.body;

                const crabId = parseInt(req.query.crabId);
                const existingCrab = await getCrabById(crabId);
                let crabImage = await CrabImagesBuilder({
                    crabId,
                    background,
                    body,
                    legs,
                    claws,
                    shell,
                    headpieces,
                });

                if (existingCrab) {
                    console.log(
                        `Found existing crab ${crabId} with id: ${existingCrab.id}, image: ${existingCrab.image} updating...`
                    );

                    if (existingCrab.image != crabImage) {
                        let crabId = existingCrab.id;
                        const updatedCrab = await updateCrabById({
                            crabId,
                            image: crabImage,
                            background,
                            body,
                            legs,
                            claws,
                            shell,
                            headpieces,
                        });
                        console.log(`Updated anomura attrs successfully`);
                        res.status(200).json({ data: "Updated anomura attrs successfully" });
                        return;
                    }
                    console.log(`No need to update crab Image`);
                    res.status(200).json({ data: {}, message: "No need to update crab Image" });
                    return;
                }

                let newCrab = await createCrab({
                    crabId,
                    background,
                    body,
                    legs,
                    claws,
                    shell,
                    crabImage ,
                    headpieces
                });
                console.log(`A new crab ${crabId} is created`);
                res.status(200).json({ data: newCrab });
                res.status(200).json({ test: 123 });
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
