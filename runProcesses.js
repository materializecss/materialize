const { exec } = require('child_process');

const runProcess = (command) => {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({
        command,
        returnCode: error ? error.code : 0,
        output: stdout || stderr
      });
    });
  });
};

const runProcesses = async (command, numberOrProcesses) => {
  const results = [];

  const promises = [];
  for (let i = 0; i < numberOrProcesses; i++) {
    const promise = runProcess(command);
    promises.push(promise);
  }
  const processResults = await Promise.all(promises);

  processResults.forEach((result) => results.push(result));

  const resultsWithNonZeroReturnCode = results.filter((value) => value.returnCode !== 0);

  console.log(resultsWithNonZeroReturnCode);
};

runProcesses('npm run originalTest', 20);
