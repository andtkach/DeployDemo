const os = require("os");
const path = require("path");

const packageJsonPath = path.join(__dirname, "..", "package.json");
const { version } = require(packageJsonPath);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = () => Math.floor(Math.random() * 999);

const main = async () => {
  await wait(randomDelay());

  const timestamp = new Date().toISOString();
  const hostname = os.hostname();

  console.log(`proc: step1 datetime=${timestamp} server=${hostname} version=${version}`);
  await wait(randomDelay());

  console.log('proc: exit');
};

main().catch((error) => {
  console.error("proc app failed:", error);
  process.exitCode = 1;
});
