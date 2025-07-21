"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var basePath = 'C:\\Users\\grak8\\code-projects\\chris-ryan';
var buildPath = basePath + '\\build';
buildAndPush();
function buildAndPush() {
    if (fs_1.default.existsSync(buildPath)) {
        fs_1.default.rmSync(buildPath, { recursive: true });
    }
    // this returns before it's done
    console.log((0, child_process_1.execSync)("npm run build", { cwd: basePath }).toString());
    while (!fs_1.default.existsSync(buildPath)) { }
    // add as command, doctl registry login
    console.log((0, child_process_1.execSync)("docker build -t registry.digitalocean.com/chrisryan/chris-ryan .", { cwd: basePath }).toString());
    console.log((0, child_process_1.execSync)("docker push registry.digitalocean.com/chrisryan/chris-ryan", { cwd: basePath }).toString());
    console.log('done');
    /*
    docker build -t registry.digitalocean.com/affogato/adfcf05889f8 .
    doctl registry login
    docker push registry.digitalocean.com/affogato/adfcf05889f8
     */
}
