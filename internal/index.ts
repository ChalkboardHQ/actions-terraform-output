import { spawn } from 'child_process';

import * as core from '@actions/core';

import { Property } from './interfaces';

let filePath = '';

async function getTerraformOutput(): Promise<Record<string, Property>> {
  return new Promise((resolve, reject) => {
    const command = spawn(
      'terraform',
      [
        'output',
        '-json'
      ],
    );

    command.stdout.on('data', data => {
      core.info(`stdout: ${data}`);
    });

    command.stderr.on('data', data => {
      core.info(`stderr: ${data}`);
    });

    command.on('error', (error) => {
      core.info(`error: ${error.message}`);
    });

    command.on('close', code => {
      core.info(`child process exited with code ${code}`);
      resolve({});
    });
  });
}

async function run(): Promise<void> {
  try {
    filePath = core.getInput('path');

    if (!filePath) {
      core.setFailed(new Error('Output file path is required'));
    }

    await getTerraformOutput();
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message);
    }
  }
}

run()
  .then(() => core.info('call run function'))
  .catch((e) => core.setFailed(e.message));
