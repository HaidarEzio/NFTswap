import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Loading } from "@nextui-org/react";
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
  const formik = useFormik({
    initialValues: {
      nft: "",
    },
    validationSchema: Yup.object({
      nft: Yup.string().min(42, "Must be 42 characters or less").required("required"),
    }),
    onSubmit: (values) => {
      part2(account.address, values.nft);
    },
  });
  const { connect, error, isConnecting, pendingConnector } = useConnect({
    chainId: chain.rinkeby.id,
    connector: new MetaMaskConnector(),
  });
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Container>
      <Containing onSubmit={formik.handleSubmit}>
        <Header>NFT swapping by DRIP.</Header>
        {account ? <EthName address={account.address} /> : null}
        <div>
          <Input
            type="text"
            name="nft"
            id="nft"
            {...formik.getFieldProps("nft")}
            disabled={!account ? true : false}
            clearable
            size="lg"
            labelPlaceholder="NFT Contract"
          />
        </div>
        {formik.touched.nft && formik.errors.nft ? <p>{formik.errors.nft}</p> : null}
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
            <Button type="submit" css={{ background: "#f50b0b" }}>
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
