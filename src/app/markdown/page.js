"use client";
import { Header } from "@/components";
import { useState, useEffect } from "react";
import {
  Extension,
  FolderType,
  WALLET,
  StorageProviderName,
} from "@dataverse/runtime-connector";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const Page = () => {
  const [data, setData] = useState("");
  const [fileName, setFileName] = useState("");
  const [folderId, setfolderId] = useState("");
  const [loader, setLoader] = useState(false);
  const [isAuth, setisAuth] = useState(true);
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

  useEffect(() => {
    const fetchFolder = async () => {
      // if (isAuth) {
      setLoader(true);
      const res = await runtimeConnector?.readFolders();
      // setFolderData(res ? res : "");
      console.log(res);
      const keys = await Object.keys(res);
      await setfolderId(keys[0]);
      setLoader(false);
    };
    // };
    fetchFolder();
  }, [runtimeConnector, isAuth]);

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

  const handleSubmit = async () => {
    if (data && fileName) {
      setLoader(true);
      const pkh = await runtimeConnector?.uploadFile({
        folderId: folderId,
        fileBase64: btoa(data),
        fileName: fileName + "_MD",
        encrypted: false,
        storageProvider: {
          name: StorageProviderName.Web3Storage,
          apiKey: process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY,
        },
      });
      console.log(pkh);
      setLoader(false);
      window.my_modal_1.showModal();
    }
  };

  return (
    <div className="bg-base-200">
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">File Uploaded Successfully</h3>
          <p className="py-4">File as been save in "Default" Folder name.</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <Link href="/cloud">
              <button className="btn">Close</button>
            </Link>
          </div>
        </form>
      </dialog>
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box flex flex-col gap-4">
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

          <div className="modal-action flex justify-center">
            <button className="btn" onClick={() => handleSubmit()}>
              Submit
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
      )}{" "}
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
      <div className="flex flex-col h-full gap-5 py-7">
        <h3 className="text-center font-semibold text-[2rem]">
          Markdown Editor
        </h3>
        <div className="mx-auto  flex gap-5">
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="textarea textarea-bordered w-[600px] h-[450px]"
            placeholder="text here"
          ></textarea>
          <div className=" w-[600px] h-[450px] bg-white rounded-2xl border drop-shadow-sm p-5 overflow-y-scroll">
            <ReactMarkdown>{data}</ReactMarkdown>
          </div>
        </div>
        <button
          className="btn btn-active btn-primary w-40 mx-auto"
          onClick={() => window.my_modal_3.showModal()}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Page;
