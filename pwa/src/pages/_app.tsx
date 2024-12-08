import { AppLayout } from "@/components/layout/appLayout";
import { WalletLayout } from "@/components/layout/walletLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <><WalletLayout><AppLayout><Component {...pageProps} /></AppLayout></WalletLayout></>;
}
