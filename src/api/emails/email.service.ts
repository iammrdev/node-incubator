import { Mailer } from "../../lib/mailer";

const buildConfirmationMessage = (code: string) => {
    return `
        <h1>Thank for your registration</h1>\n
        <p>To finish registration please follow the link below:\n
        <a href='http://localhost:5000/confirm-email?code=${code}'>complete registration</a>
        </p>
 `
}

const sendEmail = async ({ email, code }: any) => {
    return Mailer.send({
        email: email,
        subject: 'Confirm email',
        message: buildConfirmationMessage(code)
    })
}

export const EmailService = {
    sendEmail
}