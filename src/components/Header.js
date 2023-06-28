"use client";
import { useEffect, useState } from "react";
import { ConnectWallet } from ".";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/CypherSync.png";
import blockPi from "@/assets/blockPi.png";
import { Extension, WALLET } from "@dataverse/runtime-connector";
import "@particle-network/connect-react-ui/dist/index.css";
import { ConnectButton } from "@particle-network/connect-react-ui";
import { useRouter } from "next/navigation";

const Header = () => {
  const [runtimeConnector, setRuntimeConnector] = useState(null);
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");
  const [isAuth, setisAuth] = useState(true);
  const [loader, setLoader] = useState(false);
  const isBrowser = typeof window !== "undefined";
  const router = useRouter();

  useEffect(() => {
    if (isBrowser) {
      import("@dataverse/runtime-connector").then((module) => {
        const RuntimeConnector = module.RuntimeConnector;
        setRuntimeConnector(new RuntimeConnector(Extension));
      });
    }
  }, [isBrowser]);

  useEffect(() => {
    const checkcapabilities = async () => {
      const pkh = await runtimeConnector?.checkCapability(
        process.env.NEXT_PUBLIC_APP_NAME
      );
      console.log(pkh);
      if (!pkh) {
        setisAuth(false);
        return;
      } else {
        setisAuth(true);
        createcapabilities();
      }
    };
    checkcapabilities();
  }, [runtimeConnector]);

  const createcapabilities = async () => {
    setisAuth(true);
    setLoader(true);
    const pkh = await runtimeConnector.createCapability({
      app: process.env.NEXT_PUBLIC_APP_NAME,
      // resource: RESOURCE.CERAMIC,
      wallet: WALLET.METAMASK,
    });
    setLoader(false);
    await fetch(
      "https://polygon-mumbai.blockpi.network/v1/rpc/66aaf318663ab49c3eddd375ef85e7848b00d5fc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [pkh.replace("did:pkh:eip155:1:", ""), "latest"],
          id: 1,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.result);
        setBalance((Number(data.result) / 10 ** 18).toFixed(2));
        // Handle the response data here
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors here
      });
  };
  // console.log(balance);

  const visitRamp = async () => {
    const pkh = await runtimeConnector.createCapability({
      app: process.env.NEXT_PUBLIC_APP_NAME,
      // resource: RESOURCE.CERAMIC,
      wallet: WALLET.METAMASK,
    });
    window.open(
      `https://ramp.particle.network/?walletAddress=${pkh.replace(
        "did:pkh:eip155:1:",
        ""
      )}`,
      "_blank"
    );
  };
  return (
    <div>
      {loader && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      <div className="flex w-full justify-between px-7 py-3 bg-base-200 border-b border-[#d0d0d0]">
        <div className="flex gap-5">
          <Link href="/">
            <div className="font-bold text-[1.5rem] flex justify-center items-center">
              <Image src={logo} width={150}></Image>
            </div>
          </Link>
          <button className="btn btn-ghost" onClick={() => visitRamp()}>
            Buy Crypto
          </button>
        </div>
        <div className="flex gap-2">
          {balance ? (
            <div className="flex px-3 justify-center items-center gap-3 border-[#2c2c2c] rounded-xl drop-shadow-sm border">
              <Image src={blockPi} height={25} alt="blockPi"></Image>
              <div className=" flex items-center font-semibold w-[100px]">
                Balance:
                {balance}
              </div>
            </div>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => createcapabilities()}
            >
              Create Capabilites
            </button>
          )}

          <ConnectButton />
          <ConnectWallet />
        </div>
      </div>
      {!isAuth && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center z-50"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create Capabilities</h3>
            <p className="py-4">
              Please create capabilities before using the drive
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => createcapabilities()}>
                Create capability
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
