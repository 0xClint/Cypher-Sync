import lighthouse from "@lighthouse-web3/sdk";

const progressCallback = (progressData) => {
  let percentageDone =
    100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  console.log(percentageDone);
};

export async function uploadFile(file) {
  const output = await lighthouse.upload(
    file,
    process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
    progressCallback
  );
  //   console.log("File Status:", output);
  console.log("CID: " + output.data.Hash);
  //   console.log(
  //     "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
  //   );
  return output.data.Hash;
}
