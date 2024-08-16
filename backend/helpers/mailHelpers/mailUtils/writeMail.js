const nodemailer =require("nodemailer");
const fs =require("fs");
const handlebars =require("handlebars");
const path =require("path");
const { EMAIL, PASSWORD } = require("../../../config/configVariables");

const sendEmail = async (
  email,
  context,
  templateName,
  subject,
  attachments
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });
  const TEMPLATE_DIR = path.join(__dirname, `../mailTemplates`);
  const TEMPLATE_PATH = `${TEMPLATE_DIR}/main/${templateName}.html`;
  // Register partials
  handlebars.registerPartial(
    "header",
    fs.readFileSync(`${TEMPLATE_DIR}/partials/header.html`, "utf-8")
  );
  handlebars.registerPartial(
    "footer",
    fs.readFileSync(`${TEMPLATE_DIR}/partials/footer.html`, "utf-8")
  );

  const htmlFile = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  const template = handlebars.compile(htmlFile);
  const htmlToSend = template(context);
  let message;
  if (attachments === "") {
    message = {
      from: process.env.email,
      to: email,
      subject: subject,
      html: htmlToSend,
    };
  }else{
    message = {
        from: process.env.email,
        to: email,
        subject: subject,
        html: htmlToSend,
        attachments: attachments,
      };
  }
  await transporter.sendMail(message).catch((err) => {
    console.log(err);
  });
};

module.exports={sendEmail}
