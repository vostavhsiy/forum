"use client";

import { useField } from "formik";
import { Input } from "@/components/ui/input";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Paperclip, Trash2 } from "lucide-react";

export const FormikInput = ({ fileRef, ...props }: any) => {
  const [field, meta, { setValue }] = useField(props);

  if (props.type === "file") {
    const id = uuid();
    return (
      <div
        className={cn(
          "w-full flex items-center gap-2 mt-3",
          props.inmessage && "mt-0 w-max",
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            "block bg-background cursor-pointer w-full border flex items-center justify-center gap-8 p-2 rounded-2xl overflow-hidden",
            fileRef.current?.files && fileRef.current.files[0] && "",
          )}
        >
          <span
            className={cn(
              "block text-nowrap",
              fileRef.current?.files && fileRef.current.files[0] && "hidden",
            )}
          >
            {!props.inmessage && (props.label || "Выберите изображение")}
            {props.inmessage && <Paperclip />}
          </span>
          {fileRef.current?.files && fileRef.current.files[0] && (
            <span
              className={cn("text-nowrap", props.inmessage && "max-w-[80px]")}
            >
              {fileRef.current.files[0].name}
            </span>
          )}
        </label>
        {fileRef.current?.files && fileRef.current.files[0] && (
          <Button
            variant={"destructive"}
            onClick={async () => {
              await setValue("");
            }}
            type={"button"}
          >
            <Trash2 />
          </Button>
        )}
        <input type="file" {...field} {...props} ref={fileRef} id={id} hidden />
      </div>
    );
  }
  return <Input {...field} {...props} />;
};
