import tw from "tailwind-styled-components";
import { useFormik } from "formik";

import { Input, Button, Loading, css } from "@nextui-org/react";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { useConnect, useAccount, useDisconnect, chain, Connector } from "wagmi";
import EthName from "./ETHName";

const Container = tw.div`
flex
items-center
justify-center
flex-col
w-full
h-screen
`;

const Header = tw.h1`text-2xl font-bold`;
const Containing = tw.div`
flex
items-center
justify-between
flex-col
w-[25rem]
h-[30rem]
py-[46px] rounded-2xl
bg-red-400
`;
const Profile = () => {
  const formik = useFormik({
    initialValues: {
      nftHolder: "",
      nftContract: "",
    },
  });
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, error, isConnecting, pendingConnector } = useConnect({
    chainId: chain.rinkeby.id,
    connector: new MetaMaskConnector(),
  });

  return (
    <Container>
      <Containing>
        <Header>NFT swapping by DRIP.</Header>
        {account ? <EthName address={account.address} /> : null}

        <Input
          type="text"
          name="NFTholder"
          id="NFTholder"
          {...formik.getFieldProps("nftHolder")}
          disabled={!account ? true : false}
          clearable
          size="lg"
          labelPlaceholder="NFT holder"
        />
        <Input
          type="text"
          name="NFTContract"
          id="NFTContract"
          {...formik.getFieldProps("nftContract")}
          disabled={!account ? true : false}
          clearable
          size="lg"
          labelPlaceholder="NFT Contract"
        />

        {account ? (
          <div>
            <div>Connected to {account.connector.name}</div>
            <Button css={{ background: "#df0d0de4" }} onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            css={{ background: "#df0d0de4" }}
            iconRight={isConnecting && pendingConnector ? <Loading color="currentColor" size="sm" /> : ""}
            onClick={() => connect()}
          >
            {isConnecting && pendingConnector ? "Connecting..." : "Connect"}
          </Button>
        )}

        {error && <div>{error.message}</div>}
      </Containing>
    </Container>
  );
};

export default Profile;
