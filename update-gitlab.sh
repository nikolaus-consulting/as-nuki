#!/bin/bash
NOW="$(date +"%Y%m%d-%H%M")"
PROJECT="${PWD##*/}";

echo "#############################################"
echo "Update $PROJECT"
read -p "Input Description: " DESCRIPTION
echo "$NOW $DESCRIPTION"
git add . && git commit -m "$NOW $DESCRIPTION" && git push