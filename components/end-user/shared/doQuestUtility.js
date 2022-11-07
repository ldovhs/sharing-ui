import Enums from "enums";

const getDiscordAuthLink = () => {
  return `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_HOST}%2Fchallenger%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify`;
};

const getTwitterAuthLink = () => {
  return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_WEBSITE_HOST}/challenger/api/auth/twitter/redirect&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
};

/*@dev
 * if DISCORD_AUTH || TWITTER_AUTH, we do separated quest through redirect links
 * else submit a quest through api
 * 
 */
export const doQuestUtility = async (router, quest, currentQuests, onSubmit) => {
  const { questId, type, quantity, rewardTypeId, extendedQuestData } = quest;
  if (type.name === Enums.WALLET_AUTH) {
    return router.push("/auth-wallet");
  }
  // sub directory quest, should RETURN
  if (type.name === Enums.OWNING_NFT_CLAIM) {
    let path = `/nft-quest?nft=${extendedQuestData.nft}`
    return router.push(path);
  }
  if (type.name === Enums.COLLABORATION_FREE_SHELL) {
    switch (extendedQuestData.collaboration) {
      case "colormonster":
        return router.push("/colormonster");
      default:
        return router.push("/");
    }
  }
  if (type.name === Enums.DISCORD_AUTH) {
    return window.open(getDiscordAuthLink(), "_self");
  }
  if (type.name === Enums.TWITTER_AUTH) {
    return window.open(getTwitterAuthLink(), "_self");
  }
  if (type.name === Enums.JOIN_DISCORD) {
    let discordServer = extendedQuestData.discordServer;
    window.open(`https://discord.com/invite/${discordServer}`, "_blank");
  }
  if (type.name === Enums.TWITTER_RETWEET) {
    window.open(
      `https://twitter.com/intent/retweet?tweet_id=${extendedQuestData.tweetId}`,
      "_blank"
    );
  }
  if (type.name === Enums.FOLLOW_TWITTER) {
    window.open(
      `https://twitter.com/intent/follow?screen_name=${extendedQuestData.followAccount}`,
      "_blank"
    );
  }
  if (type.name === Enums.FOLLOW_INSTAGRAM) {
    window.open(`https://www.instagram.com/${extendedQuestData.followAccount}`, "_blank");
  }
  let submission = {
    questId,
    type,
    rewardTypeId,
    quantity,
    extendedQuestData,
  };

  try {

    return await onSubmit(submission, currentQuests);

  } catch (error) {
    console.log(error);
  }
};