"use client";
import React, { useEffect, useState } from "react";
import {
  Extension,
  WALLET,
  StorageProviderName,
} from "@dataverse/runtime-connector";
import { FileCard, FolderCard, Header } from "@/components";
import CancelIcon from "@/assets/cancel.png";
import Image from "next/image";

const Page = ({ params }) => {
  const [runtimeConnector, setRuntimeConnector] = useState(null);
  const isBrowser = typeof window !== "undefined";
  const [fileData, setFileData] = useState("");
  const [file, setFile] = useState("");
  const [base64Data, setBase64Data] = useState("");
  const [fileName, setFileName] = useState("");
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (isBrowser) {
      import("@dataverse/runtime-connector").then((module) => {
        const RuntimeConnector = module.RuntimeConnector;
        setRuntimeConnector(new RuntimeConnector(Extension));
      });
    }
  }, [isBrowser]);

  useEffect(() => {
    const fetchFolder = async () => {
      setLoader(true);
      const res = await runtimeConnector?.readFolders();
      //   console.log(res);
      if (res) {
        await setFileData(
          Object.keys(res[params.id].mirrors).length != 0
            ? res[params.id].mirrors
            : 0
        );
      }
      setLoader(false);
    };
    fetchFolder();
  }, [runtimeConnector]);

  const fetchIPFS = async () => {
    try {
      await fetch(
        "https://ipfs.io/ipfs/bafkreidee34nltkk32ijcgizwfp3brfypy3xantabcrxwmpuvm5mhghlum"
      )
        .then((response) => response.text())
        .then(async (data) => {
          console.log(data);
          let file = await data;
          setFile(await `data:image/png;base64,${file}`);
          setModal(true);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        console.log(base64String);
        setBase64Data(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    console.log(base64Data, fileName);
    if (base64Data && fileName) {
      setLoader(true);
      const pkh = await runtimeConnector.uploadFile({
        folderId: params.id,
        fileBase64: base64Data,
        fileName: fileName,
        encrypted: false,
        storageProvider: {
          name: StorageProviderName.Web3Storage,
          apiKey: process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY,
        },
      });
      console.log(pkh);
      setLoader(false);
    }
  };

  console.log(fileData);

  return (
    <div className="bg-base-200">
      <Header />
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box flex flex-col gap-5">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div>
            <label className="font-bold">File Name</label>
            <input
              type="text"
              placeholder="Name here"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="input input-bordered w-full mt-1"
            />
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full "
            onChange={handleFileInputChange}
          />
          <div className="modal-action flex justify-center">
            <button className="btn" onClick={() => uploadFile()}>
              Create
            </button>
          </div>
        </form>
      </dialog>
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
                Item 2
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
                Item 1
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
                Item 3
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
              Upload file +
            </button>
          </div>
          <div className="my-5 px-3 flex flex-wrap gap-10">
            {fileData ? (
              Object.keys(fileData).map((id) => {
                const { mirrorId, mirrorFile } = fileData[id];
                //   console.log(mirrorFile, mirrorId);
                return (
                  <div onClick={() => fetchIPFS()} key={mirrorId}>
                    <FileCard data={mirrorFile} />
                  </div>
                );
              })
            ) : (
              <div className="w-full h-[62vh] flex justify-center items-center text-[2rem] ">
                Folder is Empty
              </div>
            )}
          </div>
        </div>
      </div>
      {modal && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center bg-[#]"
          style={{ background: "rgba(53, 53, 53, 0.70)" }}
        >
          <Image
            src={CancelIcon}
            alt="cancel"
            width={25}
            className="absolute top-6 right-5 cursor-pointer"
            onClick={() => setModal(false)}
          ></Image>
          <img
            src={
              file
                ? file
                : "https://www.asa.edu/wp-content/themes/asa/img/holder.png"
            }
            className="h-[90%]"
          ></img>
        </div>
      )}
    </div>
  );
};

export default Page;