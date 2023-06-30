"use client";
import React, { useEffect, useState } from "react";
import {
  Extension,
  WALLET,
  StorageProviderName,
} from "@dataverse/runtime-connector";
import { FileCard, FolderCard, Header } from "@/components";
import CancelIcon from "@/assets/cancel.png";
import litLogo from "@/assets/litLogo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { LIT_ACTION_SIGN_CODE } from "@/utils/litAction";
import Link from "next/link";

const Page = ({ params }) => {
  const [runtimeConnector, setRuntimeConnector] = useState(null);
  const router = useRouter();
  const isBrowser = typeof window !== "undefined";
  const [fileData, setFileData] = useState("");
  const [file, setFile] = useState("");
  const [isMarkDown, setMarkDown] = useState(false);
  const [fileSize, setFileSize] = useState("");
  const [base64Data, setBase64Data] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectFileDelete, setSelectFileDelete] = useState("");
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
      console.log(res);
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

  const fetchIPFS = async (id, indexFileId, name) => {
    console.log(name);
    setSelectFileDelete(indexFileId);
    try {
      setLoader(true);
      await fetch(`https://ipfs.io/ipfs/${id}`)
        .then((response) => response.text())
        .then(async (data) => {
          // console.log(await atob(data));
          if (name.endsWith("_MD")) {
            setMarkDown(true);
            setFile(await atob(data));
          } else {
            let file = await data;
            setFile(await `data:image/png;base64,${file}`);
          }
          setModal(true);
        });
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFileSize(file.size);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        // console.log(base64String);
        setBase64Data(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async () => {
    // console.log(base64Data, fileName);
    if (base64Data && fileName) {
      const pkh = await runtimeConnector?.uploadFile({
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
      location.reload();
    }
  };

  const deleteFolder = async () => {
    setLoader(true);
    const res = await runtimeConnector.deleteFolder({ folderId: params.id });
    await router.push("/cloud");
    setLoader(false);
  };

  const deleteFile = async () => {
    setLoader(true);
    const res = await runtimeConnector?.removeFiles({
      indexFileIds: [selectFileDelete],
    });
    console.log(res);
    location.reload();
    setLoader(false);
  };

  const listAction = async () => {
    console.log("fileSize : " + fileSize);
    const res = await runtimeConnector.executeLitAction({
      code: LIT_ACTION_SIGN_CODE(fileSize),
      jsParams: {
        toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
        publicKey: process.env.NEXT_PUBLIC_LIT_PUBLIC_PKP,
        sigName: "sig1",
      },
    });
    await console.log(res.response);
    if (res.response) {
      setLoader(true);
      uploadFile();
    } else {
      window.my_modal_1.showModal();
    }
  };

  return (
    <div className="bg-base-200">
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">File Size error!</h3>
          <p className="py-4">Only ulpload file having size below 20MB.</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box flex flex-col gap-4">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="alert text-center alert-warning mx-auto p-0 py-2 mt-4">
            <div className="text-center w-[100%] ml-3">
              {" "}
              Please{" "}
              <Link
                href={"https://explorer.litprotocol.com/mint-pkp"}
                target={"_blank"}
                rel="noopener noreferrer"
                className="text-red-600 font-semibold"
              >
                Mint
              </Link>{" "}
              PKP{" "}
              <Link
                href={"https://faucet.litprotocol.com/"}
                target={"_blank"}
                rel="noopener noreferrer"
                className="text-red-600 font-semibold"
              >
                (LIT faucet)
              </Link>{" "}
              first before uploading files
            </div>
          </div>
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
            accept="image/*"
            onChange={handleFileInputChange}
          />
          <p className="flex items-center gap-1">
            Upload file limit: 20MB ( will be verify by Lit nodes
            <Image src={litLogo} alt="lit logo" width={20}></Image>)
          </p>
          <div className="modal-action flex justify-center">
            <button className="btn" onClick={() => listAction()}>
              Upload
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
              <h2 className="menu-title">Apps</h2>

              <Link href="/cloud" className="flex items-center">
                <svg
                  width="23"
                  viewBox="0 0 62 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    id="Vector"
                    d="M0 28.8281C0 32.7437 1.35427 36.1294 4.09225 38.9263C6.83022 41.7526 10.157 43.254 14.1021 43.4307C14.4259 43.4307 14.6025 43.254 14.6025 42.9302V39.0146C14.6025 38.6613 14.4259 38.4552 14.1021 38.4552C11.5702 38.3375 9.45044 37.3365 7.684 35.4523C5.91756 33.5681 5.03435 31.36 5.03435 28.8281C5.03435 26.414 5.85868 24.2943 7.50736 22.469C9.15603 20.6731 11.2169 19.6132 13.6899 19.3188H15.2502C15.633 19.3188 15.8391 19.1422 15.8391 18.7889L16.0157 17.1108C16.3395 13.9312 17.6938 11.2521 20.0785 9.10292C22.4632 6.95376 25.2895 5.86445 28.4985 5.86445C31.6781 5.86445 34.475 6.95376 36.8891 9.10292C39.3032 11.2521 40.6575 13.9312 40.9813 17.1108L41.2169 18.7889C41.2169 19.1422 41.3935 19.3188 41.7468 19.3188H46.4867C49.107 19.3188 51.3739 20.2609 53.2875 22.1451C55.2012 24.0293 56.1727 26.2668 56.1727 28.7987C56.1727 31.3306 55.2895 33.5386 53.523 35.4228C51.7566 37.307 49.6074 38.308 47.105 38.4258C46.7223 38.4258 46.5162 38.6024 46.5162 38.9852V42.9008C46.5162 43.2246 46.7223 43.4012 47.105 43.4012C49.6663 43.3424 52.0216 42.6358 54.1707 41.311C56.3199 39.9861 58.0275 38.2197 59.264 36.0117C60.5005 33.8036 61.1187 31.3895 61.1187 28.8281C61.1187 26.8556 60.736 24.9714 59.9705 23.205C59.2382 21.4774 58.1785 19.9078 56.8498 18.5828C55.5126 17.2627 53.9332 16.2131 52.1982 15.4915C50.4023 14.7261 48.5181 14.3434 46.5456 14.3434H45.6035C44.6968 10.5013 42.5052 7.08408 39.3916 4.65739C36.3272 2.18153 32.4968 0.84921 28.5574 0.888988C24.4063 0.888988 20.6968 2.18438 17.4877 4.77515C14.2787 7.36593 12.2179 10.6633 11.3052 14.6672C8.03729 15.4327 5.35819 17.1108 3.26791 19.7604C1.03042 22.4395 0 25.4425 0 28.8281ZM20.4318 30.6829C20.4318 31.4189 20.6673 32.0372 21.1384 32.5671C21.58 33.0087 22.1688 33.2442 22.9342 33.2442C23.6408 33.2442 24.2591 33.0087 24.7596 32.5671L28.0275 29.2109V40.9282C28.0275 41.6348 28.263 42.2236 28.7046 42.7241C29.1757 43.2246 29.735 43.4601 30.4416 43.4601C31.1187 43.4601 31.7075 43.2246 32.208 42.7241C32.7085 42.2236 32.9441 41.6348 32.9441 40.9282V29.3286L36.2414 32.5965C37.419 33.5092 38.6261 33.5092 39.8332 32.5965C40.3042 32.1549 40.5397 31.5367 40.5397 30.7712C40.5397 30.0646 40.3042 29.4758 39.8332 28.9459L32.208 21.3797C31.9774 21.1475 31.7017 20.9651 31.3979 20.8436C31.0941 20.7221 30.7687 20.664 30.4416 20.6731C29.735 20.6731 29.1462 20.9086 28.7046 21.3797L21.1089 28.9459C20.6673 29.417 20.4318 29.9763 20.4318 30.6829Z"
                    fill="black"
                  />
                </svg>
                Cypher Cloud
              </Link>
            </li>
            <li>
              <Link href="/markdown">
                <svg
                  width="22"
                  viewBox="0 0 51 55"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.3913 53H2V2H44.913V32.6M30.6087 46.88L36.7391 53L49 42.8M14.2609 26.48H32.6522M14.2609 38.72H20.3913M14.2609 14.24H32.6522"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Markdown
              </Link>
            </li>
            <li>
              <Link href="/mail">
                <svg
                  width="22"
                  viewBox="0 0 60 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.89047 0.944092H49.6353C52.0793 0.943932 54.4307 1.87899 56.2071 3.55745C57.9836 5.23591 59.0504 7.53053 59.1888 9.97059L59.2035 10.5123V38.4809C59.2037 40.9249 58.2686 43.2763 56.5901 45.0527C54.9117 46.8292 52.6171 47.896 50.177 48.0344L49.6353 48.0491H9.89047C7.44649 48.0492 5.09509 47.1142 3.31864 45.4357C1.54219 43.7573 0.475353 41.4626 0.336986 39.0226L0.322266 38.4809V10.5123C0.322106 8.06832 1.25716 5.71692 2.93563 3.94047C4.61409 2.16401 6.9087 1.09718 9.34876 0.958812L9.89047 0.944092ZM54.7874 16.7625L30.7933 29.3926C30.5224 29.5357 30.2246 29.6209 29.919 29.6426C29.6134 29.6644 29.3065 29.6224 29.018 29.5192L28.7354 29.3955L4.73836 16.7655V38.4809C4.73841 39.7739 5.22463 41.0196 6.10052 41.9707C6.9764 42.9219 8.1779 43.5089 9.46652 43.6153L9.89047 43.633H49.6353C50.9288 43.6329 52.1749 43.1462 53.1261 42.2698C54.0773 41.3933 54.6641 40.191 54.7697 38.9019L54.7874 38.4809V16.7625ZM49.6353 5.36018H9.89047C8.59746 5.36023 7.35175 5.84646 6.4006 6.72234C5.44946 7.59823 4.86242 8.79973 4.75602 10.0883L4.73836 10.5123V11.7753L29.7629 24.9441L54.7874 11.7724V10.5123C54.7873 9.21882 54.3007 7.97272 53.4242 7.0215C52.5477 6.07028 51.3454 5.48354 50.0563 5.37785L49.6353 5.36018Z"
                    fill="black"
                  />
                </svg>
                Mail
              </Link>
            </li>
            <li>
              <Link href="/post">
                <svg
                  width="22"
                  viewBox="0 0 60 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.7349 1.00359e-06C19.0207 -0.00111869 15.3662 0.934699 12.1097 2.72084C8.85322 4.50699 6.0999 7.08574 4.10457 10.2184C2.10925 13.3511 0.936405 16.9366 0.694582 20.6429C0.452759 24.3492 1.14977 28.0566 2.72112 31.422L0.589619 39.789C0.432953 40.4036 0.437791 41.0483 0.603664 41.6604C0.769536 42.2726 1.09081 42.8315 1.53633 43.283C1.98184 43.7344 2.53646 44.063 3.1464 44.237C3.75633 44.4109 4.40087 44.4243 5.01749 44.2758C7.22554 43.7458 10.62 42.9303 13.6436 42.209C16.6457 43.5628 19.9126 44.2279 23.2051 44.1556C26.4975 44.0833 29.7321 43.2755 32.6719 41.7912C35.6117 40.307 38.1823 38.184 40.1953 35.5776C42.2084 32.9713 43.6129 29.9477 44.3062 26.7282C44.9994 23.5088 44.9636 20.1751 44.2016 16.9712C43.4396 13.7673 41.9705 10.7745 39.9021 8.21192C37.8336 5.64932 35.2182 3.58186 32.2472 2.16097C29.2763 0.740067 26.0251 0.00171979 22.7319 1.00359e-06H22.7349ZM5.07048 22.0805C5.07164 18.2393 6.32481 14.5033 8.6401 11.4384C10.9554 8.37346 14.2066 6.14676 17.9011 5.09567C21.5956 4.04457 25.5321 4.22637 29.114 5.61351C32.6959 7.00066 35.728 9.51754 37.751 12.7828C39.7739 16.0481 40.6774 19.8837 40.3245 23.7086C39.9717 27.5335 38.3816 31.1391 35.7954 33.9791C33.2092 36.8192 29.7678 38.7388 25.9925 39.4472C22.2173 40.1556 18.3141 39.6141 14.8742 37.9048L14.1559 37.5486L13.3786 37.734C10.6613 38.3817 7.51994 39.1325 5.17058 39.6977L7.20198 31.7252L7.40807 30.9127L7.02534 30.1678C5.73595 27.6673 5.06556 24.8938 5.07048 22.0805ZM37.4552 52.9931C31.8855 53.0012 26.5199 50.897 22.4404 47.105H22.7349C24.8487 47.105 26.9007 46.843 28.8585 46.3484C31.4051 47.7674 34.3345 48.577 37.4552 48.577C40.2815 48.577 42.9488 47.9146 45.3158 46.737L46.0312 46.3808L46.8085 46.5662C49.5229 47.2139 52.5965 47.8763 54.8752 48.3621C54.36 46.1511 53.6563 43.1923 52.9851 40.5574L52.779 39.7448L53.1617 39C54.4521 36.4997 55.1236 33.7263 55.1195 30.9127C55.1211 27.9594 54.3815 25.0529 52.9686 22.4595C51.5556 19.8661 49.5145 17.6687 47.0322 16.0687C46.5131 13.9658 45.7213 11.9398 44.6769 10.0422C47.5996 11.0542 50.2772 12.6687 52.5363 14.7812C54.7954 16.8937 56.5857 19.4571 57.7913 22.3054C58.9969 25.1536 59.5909 28.2234 59.5348 31.3158C59.4788 34.4082 58.774 37.4544 57.466 40.2571C58.2108 43.2247 58.9645 46.4396 59.4414 48.5093C59.5813 49.1089 59.5677 49.7341 59.4019 50.3271C59.2361 50.92 58.9236 51.4617 58.4931 51.9018C58.0626 52.342 57.5281 52.6666 56.9389 52.8455C56.3498 53.0244 55.7251 53.0519 55.1225 52.9254C52.2568 52.3295 49.398 51.7014 46.5464 51.0412C43.6896 52.3319 40.59 52.9973 37.4552 52.9931Z"
                    fill="black"
                  />
                </svg>
                Cypher Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full p-4">
          <div className=" mr-10 flex justify-between">
            <h2 className="font-semibold text-[1.2rem]">Files</h2>
            <div>
              <button
                className="btn btn-outline btn-error"
                onClick={() => deleteFolder()}
              >
                Delete Folder
              </button>
              <button
                className="btn btn-outline ml-2"
                onClick={() => window.my_modal_3.showModal()}
              >
                Upload file +
              </button>
            </div>
          </div>
          <div className="my-5 px-3 flex flex-wrap gap-10">
            {fileData ? (
              Object.keys(fileData).map((id) => {
                const { mirrorId, mirrorFile } = fileData[id];
                return (
                  <div
                    onClick={() =>
                      fetchIPFS(
                        mirrorFile.contentId,
                        mirrorFile.indexFileId,
                        mirrorFile.comment.mirrorName
                      )
                    }
                    key={mirrorId}
                  >
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
          <div className="absolute top-6 right-5 cursor-pointer flex  justify-center items-center gap-7">
            <button className="btn btn-sm" onClick={() => deleteFile()}>
              Delete
            </button>
            <Image
              src={CancelIcon}
              alt="cancel"
              width={25}
              //   className="absolute top-6 right-5 cursor-pointer"
              onClick={() => {
                setModal(false);
                setSelectFileDelete("");
              }}
            ></Image>
          </div>
          {isMarkDown ? (
            <div className="bg-white w-[70%] h-[95%] p-7 overflow-y-scroll">
              <ReactMarkdown>{file}</ReactMarkdown>{" "}
            </div>
          ) : (
            <img
              src={
                file
                  ? file
                  : "https://www.asa.edu/wp-content/themes/asa/img/holder.png"
              }
              className="h-[90%]"
            ></img>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
