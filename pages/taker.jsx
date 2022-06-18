import tw from "tailwind-styled-components";
import { Button, Loading } from "@nextui-org/react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useConnect, useAccount, useDisconnect, chain } from "wagmi";

import EthName from "../components/ETHName";
import { part2 } from "../utils/swapping";
const Container = tw.div`
  flex
  items-center
  justify-center
  flex-col
  w-full
  h-screen
  `;

const Header = tw.h1`text-2xl font-bold`;
const Containing = tw.form`
  flex
  items-center
  justify-between
  flex-col
  w-[25rem]
  h-[40rem]
  py-5 rounded-2xl
  bg-red-400
  `;

const Taker = () => {
  const handleClick = () => {
    part2();
  };
  const { connect, error, isConnecting, pendingConnector } = useConnect({
    chainId: chain.rinkeby.id,
    connector: new MetaMaskConnector(),
  });
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Container>
      <Containing>
        <Header>NFT swapping by DRIP.</Header>
        {account ? <EthName address={account.address} /> : null}
        {!account ? (
          <Button
            css={{ background: "#df0d0de4" }}
            iconRight={isConnecting && pendingConnector ? <Loading color="currentColor" size="sm" /> : ""}
            onClick={() => connect()}
          >
            {isConnecting && pendingConnector ? "Connecting..." : "Connect"}
          </Button>
        ) : (
          <>
            <div>Connected to {account?.connector?.name}</div>
            <Button onClick={handleClick} css={{ background: "#f50b0b" }}>
              Fill the order !
            </Button>
            <Button css={{ background: "#290ddfe3" }} onClick={disconnect}>
              Disconnect
            </Button>
          </>
        )}

        {error && <div>{error.message}</div>}
      </Containing>
    </Container>
  );
};

export default Taker;
