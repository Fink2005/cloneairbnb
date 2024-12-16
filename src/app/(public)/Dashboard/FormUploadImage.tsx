"use client";
import { mediaApiRequest } from "@/apiRequests/media";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useUploadMediaMutation } from "@/queries/useMedia";
import { useStore } from "@/store/store";
import { DialogClose } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FormUploadImage({ setRender, render }: any) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageFileNe = useUploadMediaMutation();
  const { setFetchDataStore, setGetUserData } = useStore();

  const handleUpAvatar = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("formFile", imageFile);
      try {
        await imageFileNe.mutateAsync(formData);
        setRender(!render);
        setFetchDataStore();
      } catch (err) {
        console.log(err);
      }
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setImageFile(file);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  return (
    <div className="flex justify-center items-center flex-col space-y-4">
      <div
        {...getRootProps()}
        className="w-64 h-64 flex justify-center items-center border-4 border-dashed border-gray-400  cursor-pointer p-4 rounded-full"
      >
        <input {...getInputProps()} />

        {imagePreview ? (
          <img
            className="object-cover rounded-full  w-full h-full"
            src={imagePreview}
            width={500}
            height={500}
            alt="avatar preview"
          />
        ) : (
          <p className="text-gray-600 text-center">
            Kéo & thả một tấm hình, hoặc ấn để chọn
          </p>
        )}
      </div>
      {imagePreview && <p>Ấn & kéo thả để thay hình</p>}

      <DialogClose asChild>
        <Button variant="destructive" onClick={handleUpAvatar}>
          Cập nhật
        </Button>
      </DialogClose>
    </div>
  );
}
