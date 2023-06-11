import nodemailer from "nodemailer";
import {SendingObject} from "@/pages/api/send";
import email_sample from "@/providers/email_sample";
import {stripHtml} from "string-strip-html";

function sendEmail(address: string, data: SendingObject, callback: (error: Error | null) => void) {
    var transporter = nodemailer.createTransport({
        // @ts-ignore
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const email_body = email_sample
        .replace("$CATEGORY$", data.category)
        .replace("$SPECIFIER$", data.specifier)
        .replace("$FREEFORM$", data.freeform != "" ? stripHtml(data.freeform).result.replaceAll(/\n/g, "<br />") : "---")
        .replace("$SENDER_NAME$", data.sender.name != "" ? stripHtml(data.sender.name).result : "---")
        .replace("$SENDER_EMAIL$", data.sender.email != "" ? stripHtml(data.sender.email).result : "---")
        .replace("$SENDER_PHONE$", data.sender.phone != "" ? stripHtml(data.sender.phone).result : "---")


    console.log(email_body);

    var mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: address,
        subject: "Neue Nachricht bezüglich deines Autos",
        html: email_body
    }

    transporter.sendMail(mailOptions, function (error, info) {
        callback(error);
    });
}

export default sendEmail;