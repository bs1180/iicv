import { GoogleSpreadsheet } from "google-spreadsheet";
import { registrationSchema } from "../../utils/registration";
import requestIp from "request-ip";

const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY;

export default async (req, res) => {
  try {
    const payload = await registrationSchema.validate(req.body, { abortEarly: false });

    console.log(payload);

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: googlePrivateKey.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    const { name, address, iban, newsletter, plan, mandate_id } = payload;

    await sheet.addRow(
      {
        name,
        address,
        iban,
        newsletter,
        plan,
        signup_date: new Date(),
        mandate_id,
        ip_address: requestIp.getClientIp(req),
      },
      { insert: true }
    );

    res.json({ created: true });
  } catch (err) {
    console.log("=== Failed to register members===");

    console.error(err);
    res.status(400).json({ err });
  }
};
