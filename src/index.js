const axios = require("axios");

const appSlugs = {
  staging: [
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
    const { ref } = event.body;

    if (!ref) {
      return {
        statusCode: 400,
        body: "No ref found."
      };
    }

    const branch = getBranch(ref);

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
    }
  } catch (err) {
    throw new Error(err);
  }
};
