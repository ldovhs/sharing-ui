import s from "/sass/anomura/anomura.module.css";
export default function PondArea() {
  return (
    <div className={s.pond_zone}>
      <div className={s.pond_box}>
        {/* This is where we would put the game play video for the site. */}
        <img className={s.pond_footage} src="/img/anomura/footage_box.png" alt="" />
        <img className={s.pond_anomura} src="/img/anomura/wood_anomura.png" alt="wood_anomura" />
      </div>

    </div>
  );
}
