import tw from "tailwind-styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Loading, Modal } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect, chain } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { part2 } from "../utils/swapping";
import { ACTION_TYPES, StoreContext } from "../store/store-context";
import EthName from "../components/ETHName";

const Container = tw.div`
  flex items-center justify-center flex-col w-full h-screen 
  `;
const Header = tw.h1`text-2xl font-bold`;
const Containing = tw.form` flex items-center justify-between flex-col w-[25rem] h-[40rem] py-5 rounded-2xl  bg-red-400`;
const Loader = tw.h2`font-bold text-red-700 `;
const Required = tw.h6`font-bold text-red-700 rounded`;

const Taker = () => {
  const router = useRouter();
  const {
    state: { makerData, takerData },
  } = useContext(StoreContext);
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

  useEffect(() => {
    if (!makerData) {
      router.push("/");
    }
  }, [makerData]);

  const formik = useFormik({
    initialValues: {
      nft: "",
    },
    validationSchema: Yup.object({
      nft: Yup.string()
        .min(42, <Required>Must be 42 characters or less</Required>)
        .max(42, <Required>Must be 42 characters or less</Required>)
        .required(<Required>Required</Required>),
    }),
    onSubmit: async (values) => {
      handler();
      handlerVisible();
      if (takerData.contractAddress == values.nft && account.address == takerData.takerAddress) {
        try {
          const txhash = await part2(account.address, values.nft, makerData);
          setLoading(false);
          setVisible(false);
          dispatch({
            type: ACTION_TYPES.SET_TX_HASH,
            payload: { txhash },
          });
          router.push("/congrats");
        } catch (error) {
          console.log(error.message);
          setErrorMessage(true);
          setInterval(() => {
            router.reload(window.location.pathname);
          }, 3000);
        }
      } else {
        setErrorMessage(true);
        setInterval(() => {
          router.push("/");
          router.reload(window.location.pathname);
        }, 3000);
      }
    },
  });

  if (makerData) {
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
            {formik.touched.nft && formik.errors.nft ? <p>{formik.errors.nft}</p> : null}
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
                Fill the order !
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
};

export default Taker;
