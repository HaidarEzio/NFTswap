const EthName = function ({ address }) {
  let formattedAddress = address.substr(0, 8) + "..." + address.substr(-4);

  return <h3>{formattedAddress}</h3>;
};

export default EthName;
