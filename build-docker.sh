#!/bin/bash
PROJECT="${PWD##*/}";
PORT="3109"

echo "Script executed for $PROJECT"

if [ -z "$PORT" ]
then
	echo "empty"
	PORTMAP=""
else 
	PORTMAP="-p $PORT:$PORT/tcp"
	echo $PORTMAP
fi

echo "Build Docker container"
docker build -t nikolaus/$PROJECT .

if [ "$(docker ps -a -q -f name=$PROJECT)" ]; then
	echo "Container found"
    if [ "$(docker ps -aq -f status=running -f name=$PROJECT)" ]; then
        # cleanup
		echo "Stopping container $PROJECT"
        docker stop $PROJECT
    fi
	docker rm $PROJECT
fi

docker run -d --init -u "node" --net='bridge' -h $PROJECT --name $PROJECT $PORTMAP -e HOST_OS="Unraid" -l net.unraid.docker.icon='https://www.nikolaus-solutions.de/logo.png' -v "/mnt/user/appdata/$PROJECT":"/home/node/app/log":"rw" nikolaus/$PROJECT:latest
