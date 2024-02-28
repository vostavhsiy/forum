import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "atoian@sfedu.ru",
    pass: "9517893502r",
  },
});
