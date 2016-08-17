#!/bin/bash

set -o errexit -o nounset

npm run docs-html

openssl aes-256-cbc -K $encrypted_15377b0fdb36_key -iv $encrypted_15377b0fdb36_iv -in github_deploy_key.enc -out github_deploy_key -d
ssh-add github_deploy_key

if [ "$TRAVIS_BRANCH" != "docs" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

cd docs
git init
git config user.name "Tom MacWright"
git config user.email "tom@macwright.org"

git remote add upstream "https://github.com/mapbox/mapbox-sdk-js.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
