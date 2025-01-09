"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";

export default function FileUpload({
  onSuccess,
}: {
  onSuccess: (response: IKUploadResponse) => void;
}) {
  const [uploading, setupload] = useState(false);
  const [error, seterror] = useState<string | null>(null);
  const onError = (err: { message: string }) => {
    seterror(err.message);
    setupload(false); 
  };
  const handlesuccess = (responce: IKUploadResponse) => {
    setupload(false);
    seterror(null);
    onSuccess(responce);
  };

  const handleStartUpload = () => {
    setupload(true);
    seterror(null);
  };
  return (
    <div className="space-x-y">
      <IKUpload
        fileName="product-image.png"
        onSuccess={handlesuccess}
        onError={onError}
        onUploadStart={handleStartUpload}
        validateFile={(file: File) => {
          const valideTypes = ["iamge/png", "image/jpeg", "image/webp"];
          if (!valideTypes) {
            seterror("Invalide file type");
          }
          if (file.size > 5 * 1024 * 1024) {
            seterror("file size too lage");
          }
          return true;
        }}
      />
      {uploading && <p className="'text-sm text-gray-300">Uploading...</p>}
      {error && <p className="'text-sm text-gray-300">{error}</p> }
    </div>
  );
}
