import Image from "next/image";
import File from "@/assets/file.png";

const FileCard = ({ data }) => {
  console.log(data);
  return (
    <div className="w-40 flex flex-col cursor-pointer gap-1 ">
      <div className="icon w-40 h-36 flex items-center justify-center hover:scale-105 duration-75 ease-in-out">
        <Image src={File} alt="file" width={120}></Image>
      </div>
      <div className="contect text-center font-medium">
        {data.comment ? data.comment.mirrorName : "File Name"}
      </div>
    </div>
  );
};

export default FileCard;
