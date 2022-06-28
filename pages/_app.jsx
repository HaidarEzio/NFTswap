import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { WagmiConfig, createClient, defaultChains, configureChains } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import StoreProvider from "../store/store-context";
const alchemyId = process.env.ALCHEMY_ID;

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
