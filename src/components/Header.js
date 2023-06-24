import { ConnectWallet } from ".";

const Header = () => {
  return (
    <div className="flex w-full justify-between px-7 py-3 bg-base-200 border-b border-[#d0d0d0]">
      <div className="font-bold text-[1.5rem]">Logo</div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
