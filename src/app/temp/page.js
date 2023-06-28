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
  Currency,
} from "@dataverse/runtime-connector";
// *************************************************************
import "@particle-network/connect-react-ui/dist/index.css";
import { ConnectButton } from "@particle-network/connect-react-ui";
import { LIT_ACTION_SIGN_CODE } from "@/utils/litAction";

// did:pkh:eip155:1:0xbce910FAF9Ba3a0795d4D9E414dc52c2fCD5a587

const Page = () => {
  const [base64Data, setBase64Data] = useState("");
  const [data, setData] = useState("");
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
    const res = await runtimeConnector.connectWallet();
    console.log(res);
  };

  const createcapabilities = async () => {
    const pkh = await runtimeConnector.createCapability({
      app: process.env.NEXT_PUBLIC_APP_NAME,
      // resource: RESOURCE.CERAMIC,
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
      modelId: process.env.NEXT_PUBLIC_POST_MODEL_ID,
    });
    console.log(pkh);
  };

  const createStream = async () => {
    const pkh = await runtimeConnector.createStream({
      modelId: process.env.NEXT_PUBLIC_POST_MODEL_ID,
      streamContent: {
        appVersion: "1",
        title: "Photography",
        category: "Photography is an also type of art!",
        content: "Lorem ipsum content",
        image:
          "https://johnstillk8.scusd.edu/sites/main/files/main-images/camera_lense_0.jpeg",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    console.log(pkh);
  };

  const getDappTable = async () => {
    const pkh = await runtimeConnector.getDAppTable();
    console.log(pkh);
  };

  const getTableInfo = async () => {
    const pkh = await runtimeConnector.getDAppInfo(
      process.env.NEXT_PUBLIC_APP_NAME
    );
    console.log(pkh);
  };

  const createFolder = async () => {
    const res = await runtimeConnector.createFolder({
      folderType: FolderType.Datatoken,
      folderName: "Data Token Folder 1",
    });
    console.log(res);
  };

  const getProfile = async () => {
    const res = await runtimeConnector.getProfiles(
      "0xbce910FAF9Ba3a0795d4D9E414dc52c2fCD5a587"
    );
    return res;
  };

  const monetizeFolder = async () => {
    const res = await runtimeConnector.monetizeFolder({
      folderId:
        "kjzl6kcym7w8y5dd6uqemu1b7xmiu8ym71s36ivgqrlawb4kfa3isq8rw79wsn1",
      folderDescription: "monetize this folder",
      datatokenVars:
        "k2t6wzhkhabz2qyc4qqv5y1izo1gas0binpzeeud965qqiigx7pny9vzzqxqfe",
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

  const base64File = async () => {
    base64ToImage(data, "ss");
    function base64ToImage(base64String, altText) {
      const img = document.createElement("img");
      img.src = `data:image/png;base64,${base64String}`;
      img.alt = altText;

      // Append the image element to the document body or any other container element
      document.body.appendChild(img);
    }
  };

  const executeJsArgs = {
    code: LIT_ACTION_SIGN_CODE(2000000),
    jsParams: {
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x04427015386583bd3bc91cf7b2e89b4b80dafce8f7c622d947fa4db0ead1d069b65469beb164da8ca910317211f6513bb0f11a07c93c293d23764aaca06fa7b872",
      sigName: "sig1",
    },
  };

  const listAction = async () => {
    const res = await runtimeConnector.executeLitAction(executeJsArgs);
    console.log(res);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-3">
      <ConnectButton />
      <button onClick={() => connectWallet()} className="btn btn-neutral">
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
      <button onClick={() => monetizeFolder()} className="border py-1 px-2">
        Monetize Folder
      </button>
      <button onClick={() => getProfile()} className="border py-1 px-2">
        Get Profile
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
      <div>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
        ></textarea>
        <button onClick={() => base64File()} className="border py-1 px-2">
          Upload File
        </button>
      </div>
    </div>
  );
};

export default Page;
