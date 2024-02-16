"use client";

import { Form, Formik } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Conversation } from "@prisma/client";
import { FC, useRef, useTransition } from "react";
import { sendMessage } from "@/actions/chat.actions";
import { socket } from "@/components/Notifications";
import useOtherUser from "@/hooks/useOtherUser";
import { useSession } from "next-auth/react";

interface Props {
  conversation: Conversation;
  onSend?: Function;
}

const SendMessageForm: FC<Props> = ({ conversation, onSend }) => {
  const image = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const otherUser = useOtherUser(conversation as any);
  const session = useSession();
  return (
    <Formik
      initialValues={{ text: "", image: "" }}
      onSubmit={async (values, { resetForm }) => {
        if (!values.text) return;
        const data = new FormData();
        data.set("text", values.text);
        if (image.current?.files && image.current.files[0]) {
          data.set("image", image.current.files[0]);
        }
        startTransition(() => {
          sendMessage(conversation.id, data).then((res) => {
            if (res.ok) {
              socket.send({ type: "room-message", room: conversation.id });
              socket.send({
                type: "specific",
                messenger: true,
                ids: [otherUser.id],
                room: conversation.id,
                data: `Новое сообщение от ${session.data?.user.name}`,
              });
              resetForm();
              onSend && onSend();
            }
          });
        });
      }}
    >
      {() => (
        <Form className="flex items-center gap-4">
          <FormikInput name={"text"} placeholder={"Сообщение"} />
          <FormikInput
            name={"image"}
            type={"file"}
            fileRef={image}
            inmessage={true}
          />
          <Button disabled={isPending} type={"submit"}>
            <Send />
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SendMessageForm;
