import React from "react";
import { redirect } from "next/navigation";
import { EditForm } from "@/app/(browse)/(profile)/profile/edit/_components/EditForm";
import { auth } from "@/actions/auth.actions";

const ProfileEditPage = async () => {
  const user = await auth();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="mb-[100px] p-4 flex flex-col gap-10">
      <h1 className="text-lg font-semibold">Редактирование профиля</h1>
      <EditForm name={user.name} />
    </div>
  );
};

export default ProfileEditPage;
