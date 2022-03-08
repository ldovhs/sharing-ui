import React from 'react';
import s from "/sass/anomura/anomura.module.css";

export default function LavaBanner({ Icon, Header, Text }) {
    return (
        <div className={s.lava_banner}>
            <img className={s.lava_banner_icon} src={Icon} alt="lava banner icon" />
            <h1 className={s.lava_banner_header}>{Header}</h1>
            <p className={s.lava_banner_text}>{Text}</p>
        </div>
    );
}
