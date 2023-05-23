import nodemailer, { Transporter } from "nodemailer";

class MailSender {
  transporter: Transporter;

  constructor(options:{service?: string, auth: {user?: string, pass?: string}}) {
    this.transporter = nodemailer.createTransport(options);
  }

  sendMail(mailOptions:{from: string, to: string, subject?: string, text?: string, html?: string}) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions).then((info: any) => {
        resolve(info);
      }).catch((err: any) => {
        reject(err)
        console.log(err)
      })
    })
  }
}

export class OutlookSender extends MailSender{
  constructor(options:{service?: string, auth: {user?: string, pass?: string}}){
    super(options);
  }
}

