"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const page = () => {
  const [data, setData] = useState("aaf");
  console.log(data);
  return (
    <div className="flex gap-2 text-black">
      <textarea
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="h-96"
      ></textarea>
      <div className="h-96 w-[500px] bg-white">
        <ReactMarkdown>{data}</ReactMarkdown>
      </div>
    </div>
  );
};

export default page;
