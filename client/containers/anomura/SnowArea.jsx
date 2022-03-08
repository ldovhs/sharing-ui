import { Star } from "/components/anomura/ComponentIndex";
import s from "/sass/anomura/anomura.module.css";
export default function SnowArea() {
  return (
    <div className={s.snow_zone}>

      <div className={s.snow_earn}>
        <div className="flex flex-row items-center justify-between px-5">
          <Star></Star>
          <Star></Star>
          <Star></Star>
          <p className={s.text_outlined}>Play To Earn</p>
          <Star></Star>
          <Star></Star>
          <Star></Star>
        </div>

        <div className={s.snow_text + " text-center"}>
          <p className={s.text_earn_sub}>Earn $Starfish as you play Anomura.</p>
          <p className={s.text_earn_sub}>Stake, loot, and grow your Anomura team.</p>
        </div>
      </div>

      <div className={s.snow_protect + " text-center"}>
        <h1 className={s.text_outlined_blue}>Play To Protect</h1>
        <p className="text-[#529db3] text-[3.5rem] font-bold">Anomura are the protectors of the environment. <br />
          Contribute with your earnings to save <br />
          wild life and earn special rewards.</p>
      </div>

      <div className={s.snow_icepit}></div>
    </div >
  );
}
