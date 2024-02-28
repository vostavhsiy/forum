import React from "react";
import { NextPage } from "next";
import { Form } from "@/app/(browse)/(auth)/login/update/[link]/_components/Form";

interface Props {
  params: {
    link: string;
  };
}

const UpdatePasswordPage: NextPage<Props> = ({ params }) => {
  return (
    <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
      <h1 className="w-lg font-semibold">Введите новый пароль</h1>
      <Form link={params.link} />
    </div>
  );
};

export default UpdatePasswordPage;
