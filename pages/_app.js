import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  polygon,
  optimism,
  arbitrum,
  polygonMumbai,
  bscTestnet,
  celoAlfajores,
  avalancheFuji,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { createConfig, WagmiConfig, configureChains, mainnet } from "wagmi";
import Layout from "../components/Layout";
import { ToastContainer } from "react-toastify";

const { chains, publicClient } = configureChains(
  [polygonMumbai, bscTestnet, celoAlfajores, avalancheFuji],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <Component {...pageProps} />
        <ToastContainer autoClose={15000} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
