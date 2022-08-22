import React from "react";
import s from "/sass/claim/claim.module.css";
import { useSession } from "next-auth/react";
import { ConnectBoard, ImageUpload } from "@components/end-user";
import Enums from "enums";

function ImageSubmission() {
    const { data: session, status } = useSession({ required: false });

    return (
        <>
            <div className={s.app}>
                {!session ? <ConnectBoard /> : !process.env.NEXT_PUBLIC_ENABLE_CHALLENGER ?
                    <NotEnabledChallenger /> : <ImageUpload session={session} />}
            </div>
        </>
    );
}

export default ImageSubmission;
