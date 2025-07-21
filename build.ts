import {execSync} from "child_process";
import fs from "fs";

const basePath = 'C:\\Users\\grak8\\code-projects\\chris-ryan';
const buildPath = basePath + '\\build';

buildAndPush();

function buildAndPush() {
    if (fs.existsSync(buildPath)) {
        fs.rmSync(buildPath, { recursive: true});
    }

    // this returns before it's done
    console.log(execSync("npm run build", { cwd: basePath }).toString());

    while (!fs.existsSync(buildPath)) { }

    // add as command, doctl registry login
    console.log(execSync("docker build -t registry.digitalocean.com/chrisryan/chris-ryan .", { cwd: basePath }).toString())
    console.log(execSync("docker push registry.digitalocean.com/chrisryan/chris-ryan", { cwd: basePath }).toString())
    console.log('done');
    /*
    docker build -t registry.digitalocean.com/affogato/adfcf05889f8 .
    doctl registry login
    docker push registry.digitalocean.com/affogato/adfcf05889f8
     */
}