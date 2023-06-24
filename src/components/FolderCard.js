import Image from "next/image";
import Folder from "@/assets/folder.png";
import Link from "next/link";

const FolderCard = ({ name, id }) => {
  return (
    <Link href={`/cloud/${id}`}>
      <div className="w-40 flex flex-col cursor-pointer ">
        <div className="icon w-40 h-36 flex items-center justify-end hover:scale-105 duration-75 ease-in-out">
          <Image src={Folder} alt="folder"></Image>
        </div>
        <div className="contect text-center font-medium">
          {name ? name : "Folder Name"}
        </div>
      </div>
    </Link>
  );
};

export default FolderCard;
