"use client";
import React, { useEffect, useState } from "react";
import { Extension, FolderType, WALLET } from "@dataverse/runtime-connector";
import { FolderCard, Header } from "@/components";

const Page = () => {
  const [runtimeConnector, setRuntimeConnector] = useState(null);
  const isBrowser = typeof window !== "undefined";
  const [folderData, setFolderData] = useState("");
  const [loader, setLoader] = useState(false);
  const [folderName, setfolderName] = useState("");
  const [isAuth, setisAuth] = useState(true);

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
      }
      setisAuth(true);
    };
    checkcapabilities();
  }, [runtimeConnector]);

  const createcapability = async () => {
    setLoader(true);
    const pkh = await runtimeConnector.createCapability({
      app: process.env.NEXT_PUBLIC_APP_NAME,
      // resource: RESOURCE.CERAMIC,
      wallet: WALLET.METAMASK,
    });
    console.log(pkh);
    setLoader(false);
    location.reload();
  };

  useEffect(() => {
    const fetchFolder = async () => {
      if (isAuth) {
        setLoader(true);
        const res = await runtimeConnector?.readFolders();
        setFolderData(res ? res : "");
        console.log(res);
        setLoader(false);
      }
    };
    fetchFolder();
  }, [runtimeConnector, isAuth]);

  const connectWallet = async () => {
    const res = await runtimeConnector?.connectWallet();
    console.log(res);
  };

  const createFolder = async () => {
    if (folderName) {
      setLoader(true);
      const res = await runtimeConnector?.createFolder({
        folderType: FolderType.Private,
        folderName: folderName,
      });
      console.log(res);
      setLoader(false);
      location.reload();
    }
  };

  return (
    <div className="bg-base-200">
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg mb-2">File Name</h3>
          <input
            type="text"
            placeholder="Name here"
            value={folderName}
            onChange={(e) => setfolderName(e.target.value)}
            className="input w-full"
          />
          <div className="modal-action flex justify-center">
            <button className="btn" onClick={() => createFolder()}>
              Create
            </button>
          </div>
        </form>
      </dialog>
      {!isAuth && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create Capabilities</h3>
            <p className="py-4">
              Please create capabilities before using the drive
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => createcapability()}>
                Create capability
              </button>
            </div>
          </div>
        </div>
      )}
      {loader && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      <div className="flex h-full">
        <div className="w-64 h-[89.8vh] border-r  border-[#d0d0d0]">
          <ul className="menu bg-base-200 w-full rounded-box">
            <li>
              <h2 className="menu-title">Header</h2>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </a>
            </li>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Info
              </a>
            </li>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                View
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full p-4">
          <div className=" mr-10 flex justify-between">
            <h2 className="font-semibold text-[1.2rem]">Files</h2>
            <button
              className="btn btn-outline"
              onClick={() => window.my_modal_3.showModal()}
            >
              Create Folder +
            </button>
          </div>
          <div className="my-5 px-3 flex flex-wrap gap-10">
            {folderData ? (
              Object.keys(folderData).map((id) => {
                const { options } = folderData[id];
                return (
                  <FolderCard key={id} name={options.folderName} id={id} />
                );
              })
            ) : (
              <div className="w-full h-[80vh]">Empty</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
