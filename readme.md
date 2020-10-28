# Reads Feed

[![Greenkeeper badge](https://badges.greenkeeper.io/scriptype/feed.svg)](https://greenkeeper.io/)

![Logo](logo.png)

Sharing my "Open tabs / Read Later" list, as I go through it. You can follow
Reads Feed also on [Twitter](https://twitter.com/reads_feed) and
[Tumblr](https://readsfeed.tumblr.com). Also it's alive in its own static website:
[Github Pages](https://scriptype.github.io/feed)

## Purpose

Concept of this project is:

 - You add some links to a json file, by using a CLI helper
 - Push the changes
 - And the links you just added will be automatically published to your Twitter
   and Tumblr accounts. Plus, a static site will be deployed to Github Pages.

## Development

### Node and npm versions

```sh
$ npm -v
6.1.0

$ node -v
v10.6.0
```

### Setting it up for the first time
```sh
# Clone
git clone git@github.com:scriptype/feed.git
cd feed

# Clean .git
rm -rf .git
git init

# Reset the artifacts
rm links.json
rm -rf public/data
mkdir public/data
echo "[]" > public/data/all.json
echo "[]" > links.json

# This file will have keep secret tokens for Twitter and Tumblr
cp .env.example .env

# Install dependencies
npm i
```

### More setting up before adding links

Configure github pages to serve `docs` directory.

And, of course, you will need to register OAUTH applications on
[Twitter](https://developer.twitter.com/en/docs/basics/getting-started#get-started-app)
and [Tumblr](https://www.tumblr.com/docs/en/api/v2).

When you got the necessary auth tokens and secrets, make sure to keep them safe
and never commit them to the version control.

Now, it's the time to replace the placeholder secrets in the .env file you created
with the actual secrets you obtained from Twitter and Tumblr. .env file is in .gitignore,
so it's safe to save secrets into this file.


### Add some links!

Use the `add` helper in the root of the project. Run:

```sh
./add
```

This will ask:
- Url
- Title
- Tags

Shortly after answering these questions, it will:
- Share the link in a tweet, with tags turned into hashtags,
- Share the link as a link post in Tumblr,
- Push changes made in `links.json` file `docs/data` folder to GitHub, effectively
deploying changes to the GitHub Pages.

However, if you provide a tweet url (that is, a url in the form of: `https://twitter.com/[username]/status/[tweetId]`),
it will:
- Also ask for an optional quote (message) for the retweet
- Retweet the given tweet on Twitter account
- Attempt to extract link information from the tweet (assuming the tweet is sharing a link)
- And use this information to save that link and publish that link in other channels as usual.

### Adding links manualy

If, for any reason, you can't or don't want to use `./add` helper, you can manually
add links by appending this for each link to `links.json`:

```js
{
  "url": "link url",
  "title": "link title",
  "tags": ["some", "tags", "here"]
}
```

Then you need to run:
```sh
node scripts/generate-data | node scripts/publish
git add links.json docs
git commit -m "Add: [url of the link you added]"
git push
```

### Local development of frontend (gh-pages)
```sh
# Run dev server to serve `/docs`
npm run dev
```

## Tests

No tests.

## Licence

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```
