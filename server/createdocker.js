const { execSync } = require("child_process");

function createDockerByUserId(userid, prjid) {
  const stdout = execSync(
    `docker run -it -d -p 2002:22 --name ubuntu-cont-v1-${userid}-${prjid} ubuntu-img-v1`,
    {
      encoding: "utf-8",
    }
  );
  console.log(stdout);
  return stdout;
}

module.exports = { createDockerByUserId };
