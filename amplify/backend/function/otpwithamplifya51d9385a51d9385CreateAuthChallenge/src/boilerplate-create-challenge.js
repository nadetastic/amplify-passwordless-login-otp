/**
 * @type {import('@types/aws-lambda').CreateAuthChallengeTriggerHandler}
 */

const AWS = require('aws-sdk');
var ses = new AWS.SES();

exports.handler = async event => {

  const secretOTP = Date.now().toString().slice(-6);
  const email = event.request.userAttributes.email;

  if (event.request.session.length === 2 && event.request.challengeName === 'CUSTOM_CHALLENGE') {
    event.response.publicChallengeParameters = { trigger: 'true' };

    await sendOTP(email,secretOTP);


    event.response.privateChallengeParameters = {};
    event.response.privateChallengeParameters.answer = secretOTP; //process.env.CHALLENGEANSWER;
  }
  return event;
};


const sendOTP = async (email,code) => {
  const msg = {
    Subject: {
      Data: "Here is your OTP"
    },
    Body: {
      Text: {
        Data: 'Your login code is: ' + code
      }
    }
  }

  const params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: msg,
    Source: "dankiuna@gmail.com"
  }

  return ses.sendEmail(params).promise();

}