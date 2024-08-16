const { sendEmail } = require("./writeMail");

const sendInstructorRequestEmail = async (email) => {
  const context = {};
  sendEmail(
    email,
    context,
    "instructorSubmitRequest",
    `Educator | Your request to join us`,
    ""
  );
};
const sendAcceptInstructorEmail = async (email) => {
  const context = {};
  sendEmail(
    email,
    context,
    "acceptInstructor",
    `Educator | Your request to join us`,
    ""
  );
};
const sendRejectInstructorEmail = async (email) => {
  const context = {};
  sendEmail(
    email,
    context,
    "rejectInstructor",
    `Educator | Your request to join us`,
    ""
  );
};
const sendCertificateEmail = async (email, courseName, certificatePath) => {
  const context = {
    courseName: courseName,
    email: email,
  };
  const attachments = [
    {
      filename: "certificate.pdf",
      path: certificatePath,
      contentType: "application/pdf",
    },
  ];
  sendEmail(
    email,
    context,
    "certificateUponCompletion",
    "Educator| Congrats 🎉",
    attachments
  );
};
sendEnrollmentEmail = async (email, courseName) => {
  const context = {
    courseName: courseName,
    email: email,
  };
  sendEmail(
    email,
    context,
    "instructorCredit",
    `Educator | Course ${courseName} Enrollment 🎉`,
    ""
  );
};
sendPasswordResetEmail = async (email, token) => {
  const context = {
    url: `${process.env.FRONT_END_URL}/auth/reset?token=${token}`,
    email,
  };
  sendEmail(
    email,
    context,
    "passwordResetEmail",
    "Educator | Password Reset",
    ""
  );
};
module.exports = {
  sendInstructorRequestEmail,
  sendAcceptInstructorEmail,
  sendRejectInstructorEmail,
  sendCertificateEmail,
  sendEnrollmentEmail,
  sendPasswordResetEmail,
};
