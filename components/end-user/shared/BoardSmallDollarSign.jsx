import React from "react";
import s from "/sass/claim/claim.module.css";

import Enums from "enums";

export default function BoardSmallDollarSign() {
    return (
        <div className={s.board_dollar}>
            <div className={s.board_dollar_content}>
                <img src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`} alt="reward icon" />
                <img src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`} alt="reward icon" />
                <img src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`} alt="reward icon" />
            </div>
        </div>
    );
}
