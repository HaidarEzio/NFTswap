import tw from "tailwind-styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Loading } from "@nextui-org/react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useConnect, useAccount, useDisconnect, chain } from "wagmi";
import EthName from "../components/ETHName";
import swap from "../utils/swapping";

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
export default function App() {
  const formik = useFormik({
    initialValues: {
      nftHolder: "",
      nftContract: "",
      myNFT: "",
    },
    validationSchema: Yup.object({
      nftHolder: Yup.string().min(42, "Must be 42 characters or less").required("required"),
      nftContract: Yup.string().min(42, "Must be 42 characters or less").required("required as well"),
    }),
    onSubmit: (values) => {
      //! the values are as follows
      // {
      //*  myNFT: "0x8Ec5fAC5fCB3e9B254d5BA06eF7F74569d0fba0A"
      //*  nftContract: "0x5998AbEf6ac2105682f7799a75d4c23e423B6AbE";
      //*  nftHolder: "0x4436C8962589a491D575f7531e7f8CB79A19aEBD";
      // }
      swap(account.address, values.myNFT, values.nftHolder, values.nftContract);
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
            name="myNFT"
            id="myNFT"
            {...formik.getFieldProps("myNFT")}
            disabled={!account ? true : false}
            clearable
            size="lg"
            labelPlaceholder="My NFT Contract"
          />

          {formik.touched.myNFT && formik.errors.myNFT ? <p>{formik.errors.myNFT}</p> : null}
        </div>
        <div>
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
            labelPlaceholder="Other NFT Contract"
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
              Swap !
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
