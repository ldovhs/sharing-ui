import React from "react";
import s from "/sass/claim/claim.module.css";
import { useSession } from "next-auth/react";
import { ConnectBoard, CodeQuestSubmit } from "@components/end-user";
import Enums from "enums";

function TwitterSpaceComponent() {
    const { data: session, status } = useSession({ required: false });

    return (
        <>
            <div className={s.app}>
                {!session ? <ConnectBoard /> : <CodeQuestSubmit session={session} />}
            </div>
        </>
    );
}

export default TwitterSpaceComponent;
