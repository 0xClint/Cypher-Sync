import { ConnectWallet, Header } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header />

      <div className="hero h-[89.5vh] bg-base-200">
        <div className="hero-content text-center flex-col flex">
          <h1 className="text-5xl font-bold mb-3">Explore Apps</h1>

          <div className="flex gap-14">
            <div className=" flex flex-col gap-2 text-[1.2rem] font-semibold drop-shadow-sm cursor-pointer">
              <div className="w-72 h-72 rounded-[40px] bg-base-100"></div>
              <p>Cypher Cloud</p>
            </div>
            <div className=" flex flex-col gap-2 text-[1.2rem] font-semibold drop-shadow-sm  cursor-pointer">
              <div className="w-72 h-72 rounded-[40px] bg-base-100"></div>
              <p>Mardown Editor</p>
            </div>
            <div className=" flex flex-col gap-2 text-[1.2rem] font-semibold drop-shadow-sm  cursor-pointer">
              <div className="w-72 h-72 rounded-[40px] bg-base-100"></div>
              <p>Mail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
