import React from "react";
import s from "/sass/claim/claim.module.css";

function Unauthorized() {
    return (
        <>
            <div className={s.app}>
                <div className={s.board}>
                    <div className={s.board_container}>
                        <div className={s.board_wrapper}>
                            <div className={s.board_content}>
                                <div className="flex justify-center content-center h1 text-red-400">
                                    Unauthorized access
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={s.foreground}></div>
            </div>
        </>
    );
}

export default Unauthorized;
