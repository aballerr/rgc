#!/bin/bash
#To commit, run this file to ensure all proper steps are taken first

if [ ! "$1" ];
then
  echo "Please provide a commit message."
  exit 1
fi

npm run test

if [ $? -ne 0 ]; then
  echo "Error Unit Test(s) Failed!"
  exit 1
else
  echo "All tests passed."
fi

#Get all the outdated npm modules
outdatedModules=$(npm outdated)

#Check to see if any of the outdated modules contains create-react-app
regex="create-react-app"

if [[ $outdatedModules =~ $regex ]];
then 
  echo "create-react-app is out of date, please update before committing latest version of rgc."
else 
  git add -A
  git commit -m "$1"
  git push
  echo "Successfully committed code!"
fi;
