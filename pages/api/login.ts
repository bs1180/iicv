import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const transporter = nodemailer.createTransport({
  port: 587,
  host: "email-smtp.eu-central-1.amazonaws.com",
  auth: {
    user: process.env.IICV_AWS_ACCESS_KEY_ID,
    pass: process.env.IICV_AWS_SMTP_PASSWORD,
  },
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    await transporter.verify();
  } catch (err) {
    console.error(err);
    return res.status(500).end({ error: "Email sending disabled" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const customers = await stripe.customers.list({ limit: 100, expand: ["data.subscriptions"] });

  const customer = customers.data.find((c) => c.email === email.toLowerCase());

  // Even if no customer is found, we pretend it is to prevent leaking who our members are
  if (!customer) {
    console.log(`No email found for ${email}`);
    return res.json({ message: "Email sent" });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: "https://www.iicv.at/login",
  });

  try {
    await transporter.sendMail({
      from: "IICV <team@iicv.at>",
      to: email,
      subject: "Your login details for IICV",
      text: `
    Hi ${customer.name},

    You can manage your IICV membership with this link:

    ${session.url}

    Please note that for security reasons this link will expire after a few minutes, but can be resent at any time.

    If you have any questions or feedback, please don't hesitate to get in touch.

    Regards,

    Ben
    IICV Organising Team

    `,
    });

    return res.json({ message: "Email sent" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Failed to send email" });
  }
};
