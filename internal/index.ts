import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

import * as core from '@actions/core';

import { Property } from './interfaces';

let filePath = '';

async function getTerraformOutput(): Promise<Record<string, Property>> {
  return new Promise((resolve, reject) => {
    const command = spawn(
      'terraform',
      [
        'output',
        '-json',
      ],
    );

    let result: Record<string, Property> = {};

    command.stdout.on(
      'data',
      (data) => {
        try {
          result = JSON.parse(data) as Record<string, Property>;
          return undefined;
        } catch (e) {
          return undefined;
        }
      },
    );

    command.stderr.on(
      'data',
      (data) => reject(new Error(data)),
    );

    command.on(
      'error',
      (e) => reject(e),
    );

    command.on(
      'close',
      (code) => {
        if (code === 0) {
          return resolve(result);
        }

        return reject(new Error(`child process exited with code ${code}`));
      },
    );
  });
}

async function run(): Promise<void> {
  try {
    filePath = core.getInput('path');

    if (!filePath) {
      core.setFailed(new Error('Output file path is required'));
    }

    const result = await getTerraformOutput();
    await fs.writeFile(
      path.resolve(filePath),
      JSON.stringify(result),
    );
    core.info('end of run function call');
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message);
    }
  }
}

run()
  .then(() => core.info('call run function'))
  .catch((e) => core.setFailed(e.message));
