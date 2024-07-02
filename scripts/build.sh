#! /usr/bin/env sh

# Exit in case of error
set -e

# export TAG=latest
# ./scripts/build.sh
# docker tag backend:latest 972830530698.dkr.ecr.eu-central-1.amazonaws.com/snapi-backend:latest
# docker push 972830530698.dkr.ecr.eu-central-1.amazonaws.com/snapi-backend:latest
#TAG=${TAG?Variable not set} \
#docker-compose \
#-f docker-compose.yml \
#build

# admin@snapi.com:upt5LU0KbNF9QQV1Nnxz9

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 972830530698.dkr.ecr.eu-central-1.amazonaws.com

cd backend
docker build . -t 972830530698.dkr.ecr.eu-central-1.amazonaws.com/snapi-backend:latest
docker push 972830530698.dkr.ecr.eu-central-1.amazonaws.com/snapi-backend:latest