"use client";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

type Props = {
  setLink: (links: string) => void;
};

const ImageUpload = ({ setLink }: Props) => {
  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    const info =
      typeof result.info === "string" ? JSON.parse(result.info) : result.info;

    if (info && "secure_url" in info) {
      const link = info.secure_url;
      setLink(link);
    }
  };
  return (
    <CldUploadButton
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer w-full"
      onSuccess={handleImageUpload}
    >
      <div className="flex gap-3 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <p className="text-sm">Upload Images</p>
      </div>
    </CldUploadButton>
  );
};

export default ImageUpload;
