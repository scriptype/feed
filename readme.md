# Reads Feed

![Logo](logo.png)

Sharing my "Open tabs / Read Later" list, as I go through it. You can follow
Reads Feed also on [Twitter](https://twitter.com/reads_feed) and
[Tumblr](https://readsfeed.tumblr.com). Also it's alive in its own static website:
[Github Pages](https://scriptype.github.io/feed)

<details>
 <summary><h2>The concept</h2></summary>
 
Concept of this project is:

 - You add some links to a json file, by using a CLI helper
 - Push the changes
 - And the links you just added will be automatically published to your Twitter
   and Tumblr accounts. Plus, a static site will be deployed to Github Pages.
</details>

<details>
 <summary><h2>The look & feel</h2></summary>
If watching a video doesn't work for you, there's a detailed explanation of this flow
later in the development section.

Adding a link looks like this:

https://user-images.githubusercontent.com/5516876/207561991-00259d33-9ee2-424a-9e3c-26262a3dcb4d.mov

And let's see the results.

### Twitter

Please note that hashtags are omitted on Twitter to avoid trashy looks.

<img width="480" alt="link-on-twitter" src="https://user-images.githubusercontent.com/5516876/207563015-05d71726-9e03-49f2-b80a-712f08a23196.png">

### Tumblr

<img width="480" alt="link-on-tumblr" src="https://user-images.githubusercontent.com/5516876/207563065-1955f50b-c9de-4ce5-b61e-e76254309dfc.png">

### Static site

<img width="480" alt="link-on-site" src="https://user-images.githubusercontent.com/5516876/207563098-285ab0d3-a19b-4555-835f-06781b0b6f77.png">
</details>

<details>
 <summary><h2>Automagical retweeting</h2></summary>

If you add a link to a tweet, you will be asked for an optional retweet quote.

https://user-images.githubusercontent.com/5516876/207567328-d1f103a6-a38d-45a4-91e8-cd42fd19945a.mov

### Twitter

It will result in a retweet. And if you entered a quote, you will see it there (quote omitted here):

<img width="612" alt="retweetable link on twitter" src="https://github.com/scriptype/feed/assets/5516876/63f376c5-8ef9-4f6c-bee8-4ec553e29399">

### Tumblr and the static site

For obvious reasons, the retweeting won't work outside of Twitter. Instead, `feed` will
use the title you provided and share the link on Tumblr and the static site as usual.

<img width="732" alt="tweet link on tumblr" src="https://github.com/scriptype/feed/assets/5516876/f25b2456-0723-40b5-ae41-095c5ddde706">

<img width="670" alt="tweet link on static site" src="https://github.com/scriptype/feed/assets/5516876/f0287ef0-27b8-4f05-bdcf-ae9a87ee557d">

Previously, feed was able to fetch the link in a tweet and share _that_ link on Tumblr and static site.
But, with the current free plan, it's not possible any more. Also, the title can't be extracted from a tweet any more.
</details>

<details>
 <summary><h2>Setup</h2></summary>

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

Now, it's the time to replace the placeholder secrets in the .env.example file with the actual
secrets you obtained from Twitter and Tumblr. Save this file as `.env` (remove the `.example` part from the name).
This file is already in the .gitignore, so it's a safe place for the secret keys.
</details>

<details>
 <summary><h2>Usage</h2></summary>
 
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
node scripts/generate-data.js | node scripts/publish.js
git add links.json docs
git commit -m "Add: [url of the link you added]"
git push
```

### Local development of the static site
```sh
# Run dev server to serve `/docs`
npm run dev
```
</details>

<details>
 <summary><h2>Licence</h2></summary>
 
```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```
</details>
