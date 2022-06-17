import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { WagmiConfig, createClient, defaultChains, configureChains } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
const alchemyId = process.env.ALCHEMY_ID;

const { provider } = configureChains(defaultChains, [alchemyProvider({ alchemyId })]);

const client = createClient({
  autoConnect: true,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </WagmiConfig>
  );
}

export default MyApp;
