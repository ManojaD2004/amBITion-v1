const { execSync } = require("child_process");

function createDockerByUserId(userid, prjid, webport, sshport) {
  const stdout = execSync(
    `docker run -it -d -p ${sshport}:22 -p ${webport}:3000 --name ubuntu-cont-v1-${userid}-${prjid} ubuntu-img-v1`,
    {
      encoding: "utf-8",
    }
  );
  console.log(stdout);
  return stdout;
}

function deleteDockerByContId(contid) {
   const stdout1 = execSync(`docker container stop ${contid}`, {
     encoding: "utf-8",
   });
   const stdout2 = execSync(`docker container rm ${contid}`, {
     encoding: "utf-8",
   });
   console.log(stdout2);
   return stdout2;
}

module.exports = { createDockerByUserId, deleteDockerByContId };
