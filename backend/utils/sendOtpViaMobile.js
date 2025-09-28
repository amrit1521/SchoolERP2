const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const sendSms = async (to, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE, 
      to: `+91${to}`, 
    });
    
  } catch (err) {
    console.error("❌ SMS sending error:", err.message);
  }
};

module.exports = sendSms;







// MSG91 library
// const axios = require("axios");

// const sendSms = async (mobile, otp) => {
//   try {
//     await axios.post(
//       "https://api.msg91.com/api/v5/flow/",
//       {
//         template_id: process.env.MSG91_TEMPLATE_ID,
//         sender: "MSGIND",
//         short_url: "0",
//         mobiles: `91${mobile}`,
//         VAR1: otp,
//       },
//       {
//         headers: { authkey: process.env.MSG91_API_KEY },
//       }
//     );
//     console.log(`✅ OTP sent to ${mobile} via MSG91`);
//   } catch (err) {
//     console.error("❌ SMS sending error:", err.response?.data || err.message);
//   }
// };

// module.exports = sendSms;

