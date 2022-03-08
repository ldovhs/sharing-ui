import s from "/sass/anomura/anomura.module.css";
export default function Star({ numberOfStars }) {
    return (
        <>
            <img src="/img/anomura/star.png" className={s.star}></img>
        </>
    );
}
