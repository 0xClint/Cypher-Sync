import Image from "next/image";
import Link from "next/link";
import markdown from "@/assets/markdown.png";
import Cloud from "@/assets/cloud.png";
import mail from "@/assets/mail.png";

export default function Home() {
  return (
    <div>
      <div className="hero h-[89.5vh] bg-base-200">
        <div className="hero-content text-center flex-col flex">
          <h1 className="text-5xl font-bold mb-3">Explore Apps</h1>

          <div className="flex gap-14">
            <Link href="/cloud">
              <div className=" flex flex-col gap-2 text-[1.2rem] font-semibold drop-shadow-sm cursor-pointer">
                <div className="w-72 h-72 rounded-[40px] bg-base-100 flex justify-center items-center hover:scale-105 duration-100 ease-in-out">
                  <Image src={Cloud} width={180}></Image>
                </div>
                <p>Cypher Cloud</p>
              </div>
            </Link>
            <Link href="/markdown">
              <div className=" flex flex-col gap-2 text-[1.2rem] font-semibold drop-shadow-sm  cursor-pointer ">
                <div className="w-72 h-72 rounded-[40px] bg-base-100 flex justify-center items-center hover:scale-105 duration-100 ease-in-out">
                  <Image src={markdown} width={180}></Image>
                </div>
                <p>Mardown Editor</p>
              </div>
            </Link>
            <div className=" flex flex-col gap-2 text-[1.2rem] font-semibold drop-shadow-sm  cursor-pointer">
              <div className="w-72 h-72 rounded-[40px] bg-base-100 flex  flex-col justify-center items-center hover:scale-105 duration-100 ease-in-out">
                <Image src={mail} width={180}></Image>
                coming soon...
              </div>
              <p>Mail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
