const axios = require("axios");

const appSlugs = {
  staging: [
    "Abbey-Gardens-Staging-Android",
    "Abbey-Gardens-Staging-iOS",
    // "dthree-staging-ios",
    // "DThree-staging-android",
    "Morelands-Staging-Android",
    "Morelands-Staging-iOS",
    "Savving-Staging-Android",
    "Savvy-Staging-iOS"
  ],
  master: []
};

const allowedBranches = ["staging", "master"];

const getBranch = str => {
  const toArr = str.split("/");
  return toArr[toArr.length - 1];
};

const getUrls = branch => {
  return appSlugs[branch].map(
    slug =>
      `https://api.appcenter.ms/v0.1/apps/WeAreSavvy/${slug}/branches/${branch}/builds`
  );
};

exports.handler = async event => {
  try {
    const body = JSON.parse(event.body);
    const { ref } = body;

    console.log(event);

    if (!ref) {
      console.log("No ref in event.body");
      return {
        statusCode: 400,
        body: "No ref found."
      };
    }

    const branch = getBranch(ref);

    console.log(branch);

    if (allowedBranches.includes(branch)) {
      const calls = getUrls(branch).map(call =>
        axios.post(
          call,
          {},
          {
            headers: { "X-API-TOKEN": process.env.X_API_TOKEN }
          }
        )
      );
      const SendPOSTRequestsToAppCenter = await Promise.all(calls)
        .then(data => {
          console.log(data);
          return data;
        })
        .catch(err => {
          console.log("Here in error", err);
          throw new Error(err);
        });

      console.log("Requests:");
      console.log(SendPOSTRequestsToAppCenter);

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Branch ${branch} is not in allowedBranches, skipping.`
        })
      };
    }
  } catch (err) {
    throw new Error(err);
  }
};
