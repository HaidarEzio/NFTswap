import tw from "tailwind-styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Input, Button, Loading } from "@nextui-org/react";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { useConnect, useAccount, useDisconnect, chain } from "wagmi";
import EthName from "../components/ETHName";

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
  h-[30rem]
  py-5 rounded-2xl
  bg-red-400
  `;
export default function App() {
  const formik = useFormik({
    initialValues: {
      nftHolder: "",
      nftContract: "",
    },
    validationSchema: Yup.object({
      nftHolder: Yup.string().max(15, "Must be 15 characters or less").required("required"),
      nftContract: Yup.string().max(15, "Must be 15 characters or less").required("required as well"),
    }),
    onSubmit: (values) => {
      console.log(values);
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
            name="NFTholder"
            id="NFTholder"
            {...formik.getFieldProps("nftHolder")}
            disabled={!account ? true : false}
            clearable
            size="lg"
            placeholder="NFT holder"
          />
          {formik.touched.nftHolder && formik.errors.nftHolder ? <p>{formik.errors.nftHolder}</p> : null}
        </div>
        <div>
          <Input
            type="text"
            name="NFTContract"
            id="NFTContract"
            {...formik.getFieldProps("nftContract")}
            disabled={!account ? true : false}
            clearable
            size="lg"
            placeholder="NFT Contract"
          />

          {formik.touched.nftContract && formik.errors.nftContract ? <p>{formik.errors.nftContract}</p> : null}
        </div>
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
              Submit
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
}
