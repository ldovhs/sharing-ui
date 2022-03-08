import { Navbar } from "/containers/anomura/ContainerIndex";
import s from "/sass/anomura/anomura.module.css";
/**
 * The snow and ice area of the Anomura page
 */
export default function SkyArea() {

  return (
    <div className={s.sky_zone}>
      <Navbar />
      <div className={s.sky_text}>
        <p>Collect & Build as Anomura. the predator of all creatures big & small.</p>
        <p className={s.text_outlined}>Collect-Earn-Donate</p>
      </div>

      <div className={s.sky_anomura_zone} >
        <img className={s.sky_anomura + " " + s.wood} src="img/anomura/wood_anomura.png" alt="Wood_Anomura" />
        <img className={s.sky_anomura + " " + s.metal} src="img/anomura/metal_anomura.png" alt="Metal_Anomura" />
        <img className={s.sky_anomura + " " + s.snow} src="img/anomura/ice_anomura.png" alt="Ice_Anomura" />
      </div>

    </div>
  );
}
