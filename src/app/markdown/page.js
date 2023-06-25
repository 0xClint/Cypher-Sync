"use client";
import { Header } from "@/components";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const Page = () => {
  const [data, setData] = useState("");

  const handleSubmit = async () => {
    if (data) {
      const response = await fetch(
        "https://rpc.particle.network/ipfs/upload_json",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID +
                ":" +
                process.env.NEXT_PUBLIC_PARTICLE_SERVER_KEY
            ).toString("base64")}`,
          },
          body: data,
        }
      );

      const res = await response.json();
      console.log(res);
    }
  };
  return (
    <div className="bg-base-200">
      <Header />
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
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Page;
