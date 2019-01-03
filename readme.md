# Reads Feed

![Logo](logo.png)

Sharing my "Open tabs / Read Later" list, as I go through it. You can follow
Reads Feed also on [Twitter](https://twitter.com/reads_feed) and
[Tumblr](https://readsfeed.tumblr.com). Also it's alive in its own static website:
[Github Pages](https://scriptype.github.io/feed)

## Purpose

Concept of this project is:

 - You add some links to a json file
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

### Clone the repo
```sh
git clone git@github.com:scriptype/feed.git
```

I recommend you to delete my personal "Add link" commits before starting to your own.
And most simple way of doing that would be:

```sh
cd feed
rm -rf .git
git init
```

This way, you can start with a fresh git for your project.

### Install dependencies
```sh
cd feed
npm i
```

### Run dev server to serve `/public`
```sh
npm run dev
```

### Adding Links using `./add`

Use the `add` helper in the root of the project. Run:

```sh
./add
```

It will ask url, title, tags and whether to publish the link now.

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

Then you need to commit the changes and push to your repo. You'll need to
`git pull` before adding new links, because once you push, travis will make another
commit and push it to your repo. So, you will be 1 commit behind of origin after
publishing is done. The `./add` helper handles this step too.

### Before adding links

You need to enable travis integration for you repo.

Configure github pages to serve `public` directory.

And, of course, you will need to register OAUTH applications on
[Twitter](https://developer.twitter.com/en/docs/basics/getting-started#get-started-app)
and [Tumblr](https://www.tumblr.com/docs/en/api/v2).

When you got the necessary auth tokens and secrets, make sure to keep them safe
and never commit them to the version control.

Since this project uses Travis to build and publish things, the proper way of
exposing tokens to `/scripts` is:

 1) Encrypting each of them using [travis-cli](https://docs.travis-ci.com/user/encryption-keys/)
 2) Putting encrypted public keys to `.travis.yml`.

This is the command I used to accomplish the above tasks:

```sh
travis encrypt MY_SECRET_TOKEN_NAME="secret content here" --add
```

This will encrypt the secret and put it into `.travis.yml`.

If you cloned the repo, I recommend cleaning my own encrypted keys from `.travis.yml` before adding yours. Those will not work for you and will unnecessarily pollute your `.travis.yml`.

You can safely commit `.travis.yml` to version control.

## Tests

No tests.

## Licence

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```
