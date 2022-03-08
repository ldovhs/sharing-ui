//https://eth-ropsten.alchemyapi.io/v2/mdDQT8vEGtlr8E5ZMyWfeqZrg_TwYaL9
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: process.env.ALCHEMY_API_KEY,
      accounts: [process.env.METAMASk_SECRECT_ACCOUNT]
    }
  }
}