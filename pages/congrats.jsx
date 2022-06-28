import { useContext, useEffect } from "react";
import { StoreContext } from "../store/store-context";
import { useRouter } from "next/router";

const Congrats = () => {
  const router = useRouter();
  const {
    state: { txhash },
  } = useContext(StoreContext);

  useEffect(() => {
    if (!txhash) {
      router.push("/");
    }
  }, [txhash]);
  if (txhash) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <h1>Congratulations 🎉🥳 !!!</h1>

        <h1>
          Click{" "}
          <a className="underline transition-all hover:text-red-600" href={`https://rinkeby.etherscan.io/tx/${txhash}`}>
            here{" "}
          </a>{" "}
          to check{" "}
          <a className="underline transition-all hover:text-red-600" href={`https://rinkeby.etherscan.io/tx/${txhash}`}>
            the transaction{" "}
          </a>
          hash !!
        </h1>
      </div>
    );
  }
};

export default Congrats;
