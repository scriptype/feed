git checkout master
git config --global user.name "Travis CI"
git config --global user.email "travis@travis-ci.org"
git add -A
git commit -am "[skip ci] Generate data from new list.$LINKS_ADDED"
git status
git push --quiet https://${GITHUB_TOKEN}@github.com/scriptype/feed.git > /dev/null 2>&1
