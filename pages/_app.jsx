import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { WagmiConfig, createClient, defaultChains, configureChains } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import StoreProvider from "../store/store-context";

//* go and make a project on Alchemy, and provide the id in a .env.local
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;

//* this is basic Wagmi.js configuration for the provider and chains, you can pass your own !
//! check the Wagmi.js for more details
export const { provider } = configureChains(defaultChains, [alchemyProvider({ alchemyId })]);

const client = createClient({
  autoConnect: true,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <WagmiConfig client={client}>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </WagmiConfig>
    </StoreProvider>
  );
}

export default MyApp;
