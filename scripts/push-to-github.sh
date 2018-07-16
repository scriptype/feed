git status
git add -A
git commit -m "Generate data from new list [by travis].$LINKS_ADDED"
git push --quiet "https://${GITHUB_TOKEN}@github.com/scriptype/feed.git" origin HEAD > /dev/null 2>&1
