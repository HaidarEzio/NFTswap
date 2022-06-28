import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Loading, Modal } from "@nextui-org/react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useConnect, useAccount, useDisconnect, chain } from "wagmi";
import EthName from "../components/ETHName";
import { swap } from "../utils/swapping";
import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";
import Head from "next/head";
const Container = tw.div` flex items-center justify-center flex-col w-full h-screen  `;
const Header = tw.h1`text-3xl font-bold`;
const Containing = tw.form` flex items-center justify-between flex-col w-[25rem] h-[40rem] py-5 rounded-2xl  bg-red-400`;
const Loader = tw.h2`font-bold text-red-700 `;
const Required = tw.h6`font-bold text-red-700 rounded`;

export default function App() {
  const router = useRouter();
  const { dispatch } = useContext(StoreContext);
  const { connect, error, isConnecting, pendingConnector } = useConnect({
    chainId: chain.rinkeby.id,
    connector: new MetaMaskConnector(),
  });
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handlerVisible = () => setVisible(true);
  const handler = () => setLoading(true);

  const formik = useFormik({
    initialValues: {
      nftHolder: "",
      nftContract: "",
      myNFT: "",
    },
    validationSchema: Yup.object({
      myNFT: Yup.string()
        .min(42, <Required>Must be 42 characters or less</Required>)
        .max(42, <Required>Must be 42 characters or less</Required>)
        .required(<Required>Required</Required>), //? nicceee we can pass a function as the message !!!!
      nftHolder: Yup.string()
        .min(42, <Required>Must be 42 characters or less</Required>)
        .max(42, <Required>Must be 42 characters or less</Required>)
        .required(<Required>Required</Required>),
      nftContract: Yup.string()
        .min(42, <Required>Must be 42 characters or less</Required>)
        .max(42, <Required>Must be 42 characters or less</Required>)
        .required(<Required>Required</Required>),
    }),
    onSubmit: async (values) => {
      //! the values are as follows
      // {
      //*  myNFT: "0x8Ec5fAC5fCB3e9B254d5BA06eF7F74569d0fba0A"
      //*  nftHolder1: "0xD512872bB6448aCF6926C6C503d0Ceb8002C0557";
      //*  nftHolder2: "0x4436C8962589a491D575f7531e7f8CB79A19aEBD";
      //*  nftContract: "0x5998AbEf6ac2105682f7799a75d4c23e423B6AbE";
      //! New NFTs
      //*
      // }
      const takerData = {
        contractAddress: values.nftContract,
        takerAddress: values.nftHolder,
      };
      handler();
      handlerVisible();
      try {
        const makerData = await swap(account.address, values.myNFT, values.nftContract);
        dispatch({ type: ACTION_TYPES.SET_MAKER_DATA, payload: { makerData } });
        dispatch({ type: ACTION_TYPES.SET_TAKER_DATA, payload: { takerData } });
        setLoading(false);
        setVisible(false);
        router.push("/taker");
      } catch (error) {
        console.log(error.message);
        setErrorMessage(true);
        setInterval(() => {
          router.reload(window.location.pathname);
        }, 3000);
      }
    },
  });

  return (
    <Container>
      <Head>
        <title>NFT Swap: Maker</title>
      </Head>
      <Containing onSubmit={formik.handleSubmit}>
        <Header>NFT swapping by DRIP.</Header>
        {account ? <EthName address={account.address} /> : <h3>Please connect your wallet !</h3>}
        <div>
          <Input
            type="text"
            name="myNFT"
            id="myNFT"
            clearable
            size="lg"
            placeholder={!account ? "My NFT contract" : false}
            labelPlaceholder={account ? "My NFT contract" : false}
            disabled={!account ? true : false}
            {...formik.getFieldProps("myNFT")}
          />

          {formik.touched.myNFT && formik.errors.myNFT ? <p>{formik.errors.myNFT}</p> : null}
        </div>
        <div>
          <Input
            type="text"
            name="NFTholder"
            id="NFTholder"
            disabled={!account ? true : false}
            clearable
            size="lg"
            placeholder={!account ? "NFT holder" : false}
            labelPlaceholder={account ? "NFT holder" : false}
            {...formik.getFieldProps("nftHolder")}
          />
          {formik.touched.nftHolder && formik.errors.nftHolder ? <p>{formik.errors.nftHolder}</p> : null}
        </div>
        <div>
          <Input
            type="text"
            name="NFTContract"
            id="NFTContract"
            disabled={!account ? true : false}
            clearable
            size="lg"
            placeholder={!account ? "Other NFT Contract" : false}
            labelPlaceholder={account ? "Other NFT Contract" : false}
            {...formik.getFieldProps("nftContract")}
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
            <div>
              Connected to <span className="font-bold">{account?.connector?.name}</span> !
            </div>
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
      {loading && (
        <Modal open={visible} preventClose blur className="bg-transparent shadow-none ">
          <Loading color={errorMessage ? "error" : "primary"} size="lg">
            {!errorMessage ? "Please sign & Approve all transactions..." : "Transaction Failed, Try again"}
          </Loading>
          <Loader></Loader>
        </Modal>
      )}
    </Container>
  );
}
