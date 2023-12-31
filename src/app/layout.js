"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { ModalProvider } from "@particle-network/connect-react-ui";
import { WalletEntryPosition } from "@particle-network/auth";
import { Ethereum, EthereumGoerli } from "@particle-network/common";
import { evmWallets } from "@particle-network/connect";
import { Header } from "@/components";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Cypher Sync",
//   description: "",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ModalProvider
        options={{
          projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID,
          clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY,
          appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID,
          chains: [Ethereum, EthereumGoerli],
          particleWalletEntry: {
            //optional: particle wallet config
            displayWalletEntry: true, //display wallet button when connect particle success.
            defaultWalletEntryPosition: WalletEntryPosition.BR,
            supportChains: [Ethereum, EthereumGoerli],
            customStyle: {}, //optional: custom wallet style
          },
          securityAccount: {
            //optional: particle security account config
            //prompt set payment password. 0: None, 1: Once(default), 2: Always
            promptSettingWhenSign: 1,
            //prompt set master password. 0: None(default), 1: Once, 2: Always
            promptMasterPasswordSettingWhenLogin: 1,
          },
          wallets: evmWallets({ qrcode: false }),
        }}
        theme={"auto"}
        language={"en"} //optional：localize, default en
        walletSort={["Particle Auth"]} //optional：walelt order
        particleAuthSort={[
          //optional：display particle auth items and order
          "email",
          "phone",
          "google",
          "apple",
          "facebook",
        ]}
      >
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </ModalProvider>
    </html>
  );
}
