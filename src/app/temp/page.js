"use client";
import React, { useEffect, useState } from "react";
import {
  RuntimeConnector,
  Extension,
  WALLET,
  RESOURCE,
  StorageProvider,
  StorageProviderName,
  FolderType,
} from "@dataverse/runtime-connector";

// did:pkh:eip155:1:0xbce910FAF9Ba3a0795d4D9E414dc52c2fCD5a587
const Page = () => {
  const [base64Data, setBase64Data] = useState("");
  const [runtimeConnector, setRuntimeConnector] = useState(null);
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (isBrowser) {
      import("@dataverse/runtime-connector").then((module) => {
        const RuntimeConnector = module.RuntimeConnector;
        setRuntimeConnector(new RuntimeConnector(Extension));
      });
    }
  }, [isBrowser]);

  const connectWallet = async () => {
    const res = await runtimeConnector.connectWallet(WALLET.METAMASK);
    console.log(res);
  };

  const createcapabilities = async () => {
    const pkh = await runtimeConnector.createCapability({
      app: "tempApp",
      resource: RESOURCE.CERAMIC,
      wallet: WALLET.METAMASK,
    });
    console.log(pkh);
  };

  const checkcapabilities = async () => {
    const pkh = await runtimeConnector.checkCapability("tempApp");
    console.log(pkh);
  };

  const loadStream = async () => {
    const pkh = await runtimeConnector.loadStream({
      streamId:
        "kjzl6kcym7w8y8gdmxhozf5mnx0ormu65lj7wxnqbo2cgi5nrps56c8liyqptwk",
    });
    console.log(pkh);
  };

  const loadStreamsBy = async () => {
    const pkh = await runtimeConnector.loadStreamsBy({
      modelId:
        "kjzl6hvfrbw6cbb20v8tt0yv9qslm1yq08cccqj9p580k8kqe20ufs28ashh0pj",
    });
    console.log(pkh);
  };

  const createStream = async () => {
    const pkh = await runtimeConnector.createStream({
      modelId:
        "kjzl6hvfrbw6cbb20v8tt0yv9qslm1yq08cccqj9p580k8kqe20ufs28ashh0pj",
      streamContent: {
        appVersion: "1",
        text: "cane Photography",
        images: [
          "https://johnstillk8.scusd.edu/sites/main/files/main-images/camera_lense_0.jpeg",
          "./photo.jpg",
          "https://img-19.commentcamarche.net/cI8qqj-finfDcmx6jMK6Vr-krEw=/1500x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg",
        ],
        videos: ["./video.mp4"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        encrypted: JSON.stringify({
          text: false,
          images: false,
          videos: false,
        }),
      },
    });
    console.log(pkh);
  };

  const getDappTable = async () => {
    const pkh = await runtimeConnector.getDAppTable();
    console.log(pkh);
  };

  const getTableInfo = async () => {
    const pkh = await runtimeConnector.getDAppInfo("tempApp");
    console.log(pkh);
  };

  const createFolder = async () => {
    const res = await runtimeConnector.createFolder({
      folderType: FolderType.Datatoken,
      folderName: "Data Token Folder 1",
    });
    console.log(res);
  };
  const fetchFolder = async () => {
    const res = await runtimeConnector.readFolders();
    console.log(res);
  };
  // "kjzl6kcym7w8y6uj28bchczq0cdf1u1z9lnt4u30gzd5mtoi3ok8f5jctnbda7k";
  const uplaodFile = async () => {
    const pkh = await runtimeConnector.uploadFile({
      folderId:
        "kjzl6kcym7w8y6uj28bchczq0cdf1u1z9lnt4u30gzd5mtoi3ok8f5jctnbda7k",
      fileBase64: base64Data,
      fileName: "File1",
      encrypted: false,
      storageProvider: {
        name: StorageProviderName.Web3Storage,
        apiKey: process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY,
      },
    });
    console.log(pkh);
  };
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setBase64Data(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-3">
      <button onClick={() => connectWallet()} className="border py-1 px-2">
        Connect Wallet
      </button>
      <button onClick={() => createcapabilities()} className="border py-1 px-2">
        create capability
      </button>
      <button onClick={() => checkcapabilities()} className="border py-1 px-2">
        check capability
      </button>
      <button onClick={() => loadStream()} className="border py-1 px-2">
        load Stream
      </button>
      <button onClick={() => loadStreamsBy()} className="border py-1 px-2">
        load Streams By
      </button>
      <button onClick={() => createStream()} className="border py-1 px-2">
        Create Stream
      </button>
      <button onClick={() => getDappTable()} className="border py-1 px-2">
        Get Dapp Table
      </button>
      <button onClick={() => getTableInfo()} className="border py-1 px-2">
        Get Dapp Info
      </button>
      <button onClick={() => createFolder()} className="border py-1 px-2">
        Create Folder
      </button>
      <button onClick={() => fetchFolder()} className="border py-1 px-2">
        fetch Folder
      </button>
      <div>
        <input type="file" onChange={handleFileInputChange} />
        <button onClick={() => uplaodFile()} className="border py-1 px-2">
          Upload File
        </button>
        <div className="h-20 ">
          <p className="w-96 break-words h-20 overflow-scroll">
            Base64 Data: {base64Data}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
