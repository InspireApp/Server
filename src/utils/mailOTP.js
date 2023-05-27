import { config } from "../config/index.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto'; //to generate random token

let verificationOTP = '';
export const generateOTP = () => {
  for (let i = 0; i <= 3; i++) {
    let randVal = Math.round(Math.random() * 9);
    verificationOTP = verificationOTP + randVal;
  }
  return verificationOTP;
}

export const mailTransport = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: config.mail_trap_username,
      pass: config.mail_trap_password
    }
  });

export const generateEmail = (data, name) =>

  `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">InspireApp</a>
    </div>
    <p style="font-size:1.1em">Hi, ${name}</p>
    <p>Thank you for signing up. Use the following OTP to complete your Sign-Up procedures. OTP is valid for 60 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${data}</h2>
    <p style="font-size:0.9em;">Regards,<br />InspireApp</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>InspireApp Inc.</p>
      <p>Stutern Intertrack Project</p>
      <p>Lagos, Nigeria.</p>
    </div>
  </div>
</div>`

export const responseEmail = (name) =>

  `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">InspireApp</a>
    </div>
    <p style="font-size:1.1em">Hello, ${name}</p>
    <p>Thank you for completing your sign-up process. Your email is verified and account is now activated.</p>
    <p style="font-size:0.9em;">Regards,<br />InspireApp</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>InspireApp Inc.</p>
      <p>Stutern Intertrack Project</p>
      <p>Lagos, Nigeria.</p>
    </div>
  </div>
</div>`

export const createRandomBytes = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);

      const token = buff.toString('hex');
      resolve(token);

    });
  })


export const generatePasswordReset = (name, url) =>

  `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">InspireApp</a>
    </div>
    <p style="font-size:1.1em">Hello, ${name}</p>

    <p>It seems like you forgot your password.<br/> If this is true, click the link below to reset your password.<br/>
    <a href="${url}"><button>RESET PASSWORD</button></a> <br /> If you did not forget your password, please disregard this email.</p>

    <p style="font-size:0.9em;">Regards,<br />InspireApp</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>InspireApp Inc.</p>
      <p>Stutern Intertrack Project</p>
      <p>Lagos, Nigeria.</p>
    </div>
  </div>
</div>`

export const passwordResetConfirm = (name) =>

  `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">InspireApp</a>
    </div>
    <p style="font-size:1.1em">Hello, ${name}</p>
    <p>Thank you, your password has been reset successfully. Now you can login with your new password.</p>
    <p style="font-size:0.9em;">Regards,<br />InspireApp Team</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>InspireApp Inc.</p>
      <p>Stutern Intertrack Project</p>
      <p>Lagos, Nigeria.</p>
    </div>
  </div>
</div>`
