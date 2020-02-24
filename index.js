const allowedBranches = ["staging", "master"];

const getBranch = str => {
  const toArr = str.split("/");
  return toArr[toArr.length - 1];
};

exports.handler = async event => {
  console.log("hello world");

  console.log(event);

  try {
    const { ref } = event.body;

    const branch = getBranch(ref);

    if (allowedBranches.includes(branch)) {
      console.log("Post to APpCenter");
    }
  } catch (err) {
    throw new Error(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(event)
  };
};
