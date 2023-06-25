"use client";
import { useEffect, useState } from "react";
import { ConnectWallet } from ".";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Extension, WALLET } from "@dataverse/runtime-connector";

const Header = () => {
  const [runtimeConnector, setRuntimeConnector] = useState(null);
  const [balance, setBalance] = useState("");
  const [isbalance, setIsBalance] = useState(false);
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (isBrowser) {
      import("@dataverse/runtime-connector").then((module) => {
        const RuntimeConnector = module.RuntimeConnector;
        setRuntimeConnector(new RuntimeConnector(Extension));
      });
    }
  }, [isBrowser]);

  const createcapabilities = async () => {
    const pkh = await runtimeConnector.createCapability({
      app: "tempApp",
      // resource: RESOURCE.CERAMIC,
      wallet: WALLET.METAMASK,
    });
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
        console.log(data.result);
        setBalance((Number(data.result) / 10 ** 18).toFixed(2));
        // Handle the response data here
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors here
      });
  };
  console.log(balance);
  return (
    <div className="flex w-full justify-between px-7 py-3 bg-base-200 border-b border-[#d0d0d0]">
      <Link href="/">
        <div className="font-bold text-[1.5rem] flex justify-center items-center">
          <Image src={logo} width={45}></Image>
        </div>
      </Link>
      <div className="flex gap-2">
        {balance ? (
          <div className=" flex items-center font-semibold w-28">
            Balance:
            {balance}
          </div>
        ) : (
          <button
            className="btn btn-outline"
            onClick={() => createcapabilities()}
          >
            Create Capabilites
          </button>
        )}

        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
