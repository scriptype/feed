# Set up your own [POSSE](https://indieweb.org/POSSE) feed

Reads Feed helps you save and share your links/bookmarks without relying on external services.

Your links are indexed and stored locally in your computer until you decide to push to GitHub.

Once you push,

- A static site, built with [Writ-CMS](https://github.com/scriptype/writ-cms), will be deployed to
GitHub pages
- The static site will enable subscription via RSS
- Links will be shared on your Twitter and Tumblr accounts

## Usage overview

 - Add some links to a json file, by using `./add` CLI helper
 - To preview your feed, run `npm start`
 - To finalize, run `npm run build`
 - Make it public by pushing to GitHub (`./add` will ask doing it for you)

**Note: Publishing multiple/batch links at once is not tested.**

## Install

Fork this repository to your account, and then:

```sh
# Clone
git clone git@github.com:<YOUR_USERNAME>/feed.git
cd feed

# You may optionally want to clean up git history at this point

# Install dependencies
npm i

# Reset the links
rm links.json
echo "[]" > links.json

# Add a link
./add
```

## Social media APIs

You will need to register OAUTH applications on
[Twitter](https://developer.twitter.com/en/docs/basics/getting-started#get-started-app)
and [Tumblr](https://www.tumblr.com/docs/en/api/v2) for social sharing to work.

Then go to your repository settings and add the secrets as repository secrets:

<img width="711" alt="Preview of my repository variables" src="https://github.com/scriptype/feed/assets/5516876/4039770c-6579-45dc-9355-c8eecc6a8a25">

**The secrets are _secrets_, so make sure never to make them public**

## The look & feel

Adding a link looks like this:

https://user-images.githubusercontent.com/5516876/207561991-00259d33-9ee2-424a-9e3c-26262a3dcb4d.mov

> Update: Now it will also confirm whether to push changes (and trigger publish) or not.

Run `./add` in the root of the project.

This will ask:
- Url
- Title
- Retweet quote (if link is a tweet)
- Tags
- Whether to publish now

If you choose to publish now, changes will be pushed to GitHub, triggering the workflows for social sharing and deploying to GitHub Pages.

And let's see the results.

### Twitter

Hashtags are omitted on Twitter to avoid the trashy/spammy look.

<img width="480" alt="link-on-twitter" src="https://user-images.githubusercontent.com/5516876/207563015-05d71726-9e03-49f2-b80a-712f08a23196.png">

### Tumblr

<img width="480" alt="link-on-tumblr" src="https://user-images.githubusercontent.com/5516876/207563065-1955f50b-c9de-4ce5-b61e-e76254309dfc.png">

### Static site

<img width="480" alt="link-on-site" src="https://user-images.githubusercontent.com/5516876/207563098-285ab0d3-a19b-4555-835f-06781b0b6f77.png">

## Automagical retweeting

If you add a tweet link, you will be asked for an optional retweet quote.

https://user-images.githubusercontent.com/5516876/207567328-d1f103a6-a38d-45a4-91e8-cd42fd19945a.mov

It will result in a retweet on Twitter, with the quote you entered. Elsewhere the link itself will be shared as usual.

<img width="612" alt="retweetable link on twitter" src="https://github.com/scriptype/feed/assets/5516876/63f376c5-8ef9-4f6c-bee8-4ec553e29399">

Previously, feed was able to fetch the link in a tweet and share _that_ link on Tumblr and static site.
But, with the Twitter's current free API it's not possible any more. Similarly, the title can't be extracted from a tweet any more.

***

I hope my instructions are clear and helpful. If you get stuck, you can always open an issue or contact me and I'll be happily helping you ✌️

If you find this project helpful, please consider [supporting me](https://github.com/sponsors/scriptype) 💛
