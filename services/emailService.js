import nodemailer from "nodemailer";

const {
  UKR_NET_SMTP_HOST,
  UKR_NET_SMTP_PORT,
  UKR_NET_SMTP_SECURE,
  UKR_NET_FROM_NAME,
  UKR_NET_FROM_EMAIL,
  UKR_NET_PASSWORD,
} = process.env;

/**
 * Configuration object for Nodemailer transport.
 *
 * @property {string} host SMTP server host.
 * @property {number} port SMTP server port.
 * @property {boolean} secure If true, uses SSL/TLS for secure connection.
 * @property {Object} auth Authentication details.
 * @property {string} auth.user Email address for authentication.
 * @property {string} auth.pass Password for authentication.
 */
const nodemailerConfig = {
  host: UKR_NET_SMTP_HOST,
  port: Number(UKR_NET_SMTP_PORT),
  secure: UKR_NET_SMTP_SECURE,
  auth: {
    user: UKR_NET_FROM_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

/**
 * Default sender information for outgoing emails.
 *
 * @property {string} name Sender's name.
 * @property {string} address Sender's email address.
 */
const from = {
  name: UKR_NET_FROM_NAME,
  address: UKR_NET_FROM_EMAIL,
};

/**
 * Nodemailer transporter instance configured with SMTP settings.
 */
export const transporter = nodemailer.createTransport(nodemailerConfig);

/**
 * Sends an email using the configured Nodemailer transporter.
 *
 * @param {Object} data Email data.
 * @param {string} data.to Recipient's email address.
 * @param {string} data.subject Subject of the email.
 * @param {string} data.html HTML content of the email.
 * @returns {Promise<nodemailer.SentMessageInfo>} - Promise resolving to the result of the email send operation.
 */
export const sendEmail = data => {
  const emailOptions = { ...data, from };
  return transporter.sendMail(emailOptions);
};
