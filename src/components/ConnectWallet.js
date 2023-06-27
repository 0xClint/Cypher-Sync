"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import metamask from "@/assets/metamask.png";

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };
  return (
    <div>
      {walletAddress && walletAddress.length > 0 ? (
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src="https://e7.pngegg.com/pngimages/348/800/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child.png" />
            </div>
          </div>
          {/* <div className="text-primary">
            <h3 className="font-semibold m-0">Guest</h3>
            <p className="text-[0.8rem]">
              {`${walletAddress.substring(0, 6)}...
          ${walletAddress.substring(38)}`}
            </p>
          </div> */}
        </div>
      ) : (
        <button className="btn btn-active btn-neutral" onClick={connectWallet}>
          Connect <Image src={metamask} width={30}></Image>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
