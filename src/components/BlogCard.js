import Link from "next/link";

const BlogCard = ({ data, id }) => {
  // console.log();
  return (
    <Link href={`/post/${id}`}>
      <div className="w-[350px]">
        <div className="imgContainer w-full h-[250px] overflow-hidden rounded-2xl flex justify-center items-center border drop-shadow-sm">
          <img
            src={
              data
                ? `https://gateway.lighthouse.storage/ipfs/${data.content.image}`
                : "https://cdn.questionpro.com/userimages/site_media/no-image.png"
            }
            alt="post"
            className="w-[100%]"
          ></img>
        </div>
        <div className="flex flex-col my-1">
          <p className="text-[#2CAE8F] font-medium text-sm">
            {data ? data.content.category : "Category"}
          </p>
          <p className="font-bold">{data ? data.content.title : "Title"}</p>
          <p className="text-[#878181] font-normal text-sm">
            {data ? data.content.createdAt : "20th February, 2023"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
