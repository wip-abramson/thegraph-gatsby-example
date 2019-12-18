export const DAI = "DAI";
export const ETH = "ETH";
export const ETH_TO_DAI = 150;

export const getRelativeDaiValue = (tokenName, tokenValue) => {

  return tokenName === ETH ? tokenValue * ETH_TO_DAI : parseFloat(tokenValue)

}
