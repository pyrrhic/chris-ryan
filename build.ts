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
/*
aws ecr get-login-password --region us-east-2 \
   | docker login \
       --username AWS \
       --password-stdin 683123173152.dkr.ecr.us-east-2.amazonaws.com

docker build -t chris-ryan:0.0.1 .

docker tag demo-app:0.0.1 \
     683123173152.dkr.ecr.us-east-2.amazonaws.com/scryspell:0.0.1

docker push 683123173152.dkr.ecr.us-east-2.amazonaws.com/scryspell:0.0.1

all together:

aws ecr get-login-password --region us-east-2 \
  | docker login --username AWS --password-stdin 683123173152.dkr.ecr.us-east-2.amazonaws.com && \
docker build -t chris-ryan:0.0.1 . && \
docker tag chris-ryan:0.0.1 683123173152.dkr.ecr.us-east-2.amazonaws.com/chris-ryan:0.0.1 && \
docker push 683123173152.dkr.ecr.us-east-2.amazonaws.com/chris-ryan:0.0.1
 */