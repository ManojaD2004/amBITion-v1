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

function createDockerLoadBalancer(
  userid,
  prjid,
  webport,
  githubLink1,
  githubLink2,
  metrics = { memory: "512M", storage: "4G", cpus: ".5" }
) {
  const stdoutPre = execSync(`docker network create ${userid}-${prjid}-net`, {
    encoding: "utf-8",
  });
  console.log(stdoutPre);
  const stdout1 = execSync(
    `docker run -it -d --network ${userid}-${prjid}-net --storage-opt size=${metrics.storage} -m ${metrics.memory} --cpus="${metrics.cpus}" --name test-nodejs-app-v1 test-nodejs-app-v1 sh -c  "git clone ${githubLink1} ./ && npm i && npm run build && npm run start"`,
    {
      encoding: "utf-8",
    }
  );
  console.log(stdout1);
  const stdout2 = execSync(
    `docker run -it -d --network ${userid}-${prjid}-net --storage-opt size=${metrics.storage} -m ${metrics.memory} --cpus="${metrics.cpus}" --name test-nodejs-app-v2 test-nodejs-app-v1 sh -c  "git clone ${githubLink2} ./ && npm i && npm run build && npm run start"`,
    {
      encoding: "utf-8",
    }
  );
  console.log(stdout2);
  const stdout3 = execSync(
    `docker run -it -d --network ${userid}-${prjid}-net -p ${webport}:80 --storage-opt size=${metrics.storage} -m ${metrics.memory} --cpus="${metrics.cpus}" --name test-load-balance-${userid}-${prjid} my-nginx-v2-userid`,
    {
      encoding: "utf-8",
    }
  );
  console.log(stdout3);
  return [stdout1, stdout2, stdout3];
}

function deleteDockerLoadBalancer(
  userid,
  prjid,
  contIds,
) {
  for (let index = 0; index < contIds.length; index++) {
    const stdout2 = execSync(`docker container stop ${contIds[i]}`, {
      encoding: "utf-8",
    });
    console.log(stdout2);
    const stdout3 = execSync(`docker container rm ${contIds[i]}`, {
      encoding: "utf-8",
    });
    console.log(stdout3);
  }
   const stdoutPre = execSync(`docker network rm ${userid}-${prjid}-net`, {
     encoding: "utf-8",
   });
   console.log(stdoutPre);
  return stdoutPre;
}

module.exports = {
  createDockerByUserId,
  deleteDockerByContId,
  createDockerCiCdVersion,
  createDockerLoadBalancer,
  deleteDockerLoadBalancer
};
