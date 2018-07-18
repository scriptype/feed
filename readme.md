# Reads Feed

![Logo](logo.png)

Sharing my "Open tabs / Read Later" list, as I go through it. You can follow
Reads Feed also on [Twitter](https://twitter.com/reads_feed) and
[Tumblr](https://readsfeed.tumblr.com). Also it's alive in its own static website:
[Github Pages](https://scriptype.github.io/feed)

## Development

Concept of this project is:

 - You add some links to a json file
 - Push the changes
 - And the links you just added will be automatically published in your Twitter
   and Tumblr accounts. Plus, a static site will be deployed to Github Pages.

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

### Install dependencies
```sh
cd feed
npm i
```

### Run dev server to serve `/public`
```sh
npm run dev
```

### Adding Links

You need to append your links to `links.json`. Then just commit the change and
push to the repository. Make sure you've enabled travis for the repo. Travis
will handle the rest.

TODO: Create a cli helper to add links more easily.

### Before adding links

Of course, you will need to register OAUTH applications on
[Twitter](https://developer.twitter.com/en/docs/basics/getting-started#get-started-app)
and [Tumblr](https://www.tumblr.com/docs/en/api/v2).

Once you get the necessary auth tokens and secrets, make sure to keep them safe
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

You can safely commit `.travis.yml` to version control.

## Tests

No tests.

## Licence

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```
