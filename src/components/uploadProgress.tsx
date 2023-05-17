import React from "react";

type Props = {
  progress: number;
};

const UploadProgress = ({ progress }: Props) => {
  return (
    <>
      <div className="my-2 mr-4 flex w-full items-center justify-center text-white">
        <div className="flex h-2 w-full rounded bg-gray-200">
          <div
            className="h-full animate-pulse rounded bg-blue-500"
            style={{ width: progress + "%" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default UploadProgress;
