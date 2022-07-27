# schaufel

TikTok utilities for Dataskop

## Dev setup

We are storing HTML test files with [git lfs](https://git-lfs.github.com/).
Please set it up.

```
npm i
```

## Release a new Version

Choose a new version according to <https://semver.org/>.

```bash
npm version major
npm version minor
npm version patch
npm version prerelease
```

Push tags to GitHub.
GitHub then publishes the package as a GitHub Package.

```bash
git push --follow-tags
```

## License

MIT
