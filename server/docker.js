const { execSync } = require("child_process");

function createDockerByUserId(
  userid,
  prjid,
  webport,
  sshport,
  metrics = { memory: "512M", storage: "4G", cpus: ".5" }
) {
  const stdout = execSync(
    `docker run -it -d -p ${sshport}:22 -p ${webport}:3000 --storage-opt size=${metrics.storage} -m ${metrics.memory} --cpus="${metrics.cpus}" --name ubuntu-cont-v1-${userid}-${prjid} ubuntu-img-v1`,
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

function createDockerCiCdVersion(
  userid,
  prjid,
  webport,
  githubLink,
  metrics = { memory: "512M", storage: "4G", cpus: ".5" }
) {
  const stdout = execSync(
    `docker run -it -d -p ${webport}:3000 --storage-opt size=${metrics.storage} -m ${metrics.memory} --cpus="${metrics.cpus}" --name ci-cd-server-v1-${userid}-${prjid} test-ci-cd-v1 ${githubLink}`,
    {
      encoding: "utf-8",
    }
  );
  console.log(stdout);
  return stdout;
}

module.exports = { createDockerByUserId, deleteDockerByContId, createDockerCiCdVersion };
