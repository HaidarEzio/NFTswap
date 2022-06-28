const EthName = function ({ address }) {
  let formattedAddress = address.substr(0, 8) + "..." + address.substr(-4);

  return <h2>{formattedAddress}</h2>;
};

export default EthName;
