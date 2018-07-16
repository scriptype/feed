git config user.name "Travis CI"
git config user.email "travis@travis-ci.org"
git status
git add -A
git commit -m "Generate data from new list.$LINKS_ADDED"
git push --quiet "https://${GITHUB_TOKEN}@github.com/scriptype/feed.git" origin master > /dev/null 2>&1
