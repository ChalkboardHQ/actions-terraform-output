"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const core = tslib_1.__importStar(require("@actions/core"));
let filePath = '';
async function getTerraformOutput() {
    return new Promise((resolve, reject) => {
        const command = (0, child_process_1.spawn)('terraform', [
            'output',
            '-json'
        ]);
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
async function run() {
    try {
        filePath = core.getInput('path');
        if (!filePath) {
            core.setFailed(new Error('Output file path is required'));
        }
        await getTerraformOutput();
    }
    catch (e) {
        if (e instanceof Error) {
            core.setFailed(e.message);
        }
    }
}
//# sourceMappingURL=index.js.map