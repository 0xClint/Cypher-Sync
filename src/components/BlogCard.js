import mail from "@/assets/mail.png";
import Image from "next/image";

const BlogCard = () => {
  return (
    <div className="w-[350px]">
      <div className="imgContainer w-full h-[250px] overflow-hidden rounded-2xl">
        <Image src={mail} alt="post" width={350}></Image>
      </div>
      <div className="flex flex-col my-1">
        <p className="text-[#2CAE8F] font-medium text-sm">THEME: sdasdsad</p>
        <p className="font-bold">Titleee</p>
        <p className="text-[#878181] font-normal text-sm">
          20th February, 2023
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
