aws ecr get-login-password --region us-east-2 \
  | docker login --username AWS --password-stdin 683123173152.dkr.ecr.us-east-2.amazonaws.com && \
docker build -t chris-ryan:0.0.1 . && \
docker tag chris-ryan:0.0.1 683123173152.dkr.ecr.us-east-2.amazonaws.com/chris-ryan:0.0.1 && \
docker push 683123173152.dkr.ecr.us-east-2.amazonaws.com/chris-ryan:0.0.1