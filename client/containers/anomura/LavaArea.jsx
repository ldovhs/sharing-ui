import s from "/sass/anomura/anomura.module.css";
import LavaBanner from "/components/anomura/LavaBanner";

export default function LavaArea() {

  const buildText = "Anomura is a strategic game of skill. Optimize and build.";
  const lootText = "Anomura Acquire rare loot and equipment from many monsters.";
  const craftText = "Combine the loot you get to craft all powerful gear to dominate the crabverse.";
  return (
    <div className={s.lava_zone}>
      <div className={s.lava_banner_zone + " flex justify-around"}>
        <LavaBanner Header="Build" Text={buildText} Icon="/img/anomura/icons/lava_banner_1.png"></LavaBanner>
        <LavaBanner Header="Loot" Text={lootText} Icon="/img/anomura/icons/lava_banner_2.png"></LavaBanner>
        <LavaBanner Header="Craft" Text={craftText} Icon="/img/anomura/icons/lava_banner_3.png"></LavaBanner>
      </div>
    </div>
  );
}
