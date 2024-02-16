"use client";

import { useField } from "formik";
import { Textarea } from "@/components/ui/textarea";

export const FormikTextarea = (props: any) => {
  const [field, meta] = useField(props);

  return <Textarea {...field} {...props} />;
};
