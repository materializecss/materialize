# For Maintainers
This is the documentation that will be used by the maintainers. If you have ideas on how to do things better, please let us know by creating an issue or PR 😉.

- [Labels](#labels)
- [Releasing a new version](#releasing-a-new-version)

## Labels
We have several labels that can be used to organize issues and PRs on this repo and also to make the changelog generation easier. All the labels and their descriptions can be [read here](https://github.com/materializecss/materialize/issues/labels). Any other PRs that hasn't labeled with one of these will not be shown on the changelog. Please take a look at the table below

| Label         | Section                  |
|---------------|--------------------------|
| enhancement   | Implemented enhancements |
| bug           | Fixed bugs               |
| documentation | Documentation changes    |
| meta          | Meta changes             |

## Releasing a new version
To fully release a new version, you need to have access to the @materializecss organization on the npmjs. Then, please follow the steps below:

- In your local copy of Materialize, go into the dev Branch with `git checkout v2-dev` and pull the newest version
   with `git pull origin v2-dev` to have the newest version from the server. Run Tests and check if everything works.

- Create a new Release branch with `git checkout -b release-2.X.X`.
   In case something happens or needs to be changed during the release it is better to keep the release on its own branch.

- Run `npm version <change-type>`
   Where `<change-type> = patch, minor, major`. 
   [details](https://docs.npmjs.com/updating-your-published-package-version-number)

- Verify that the version is correctly replaced and files were generated in:
   * package.json
   * src/index.ts
   * dist/js
   * dist/css

- (Add Commit with message "chore: release 2.X.X-alpha")

- Push to server. `git push --tags`. Remember to push the tags aswell.

- Create a Pull Request (PR) into dev (dev <-- release-branch)

- Create a PR (main <-- dev)

- Merge the Pull Request if all checks pass and there were no concerns. (Set the draft release to public.)

- Create a new release on GitHub [New Release](https://github.com/materializecss/materialize/releases/new)
   * Select the tag from the pushed commit
   * Click "generate Release notes"
   * Upload the zip-files from the dist-folder.

- Checkout and pull main branch locally

- Publish the release on npmjs
   * If you never logged in on npm, please do `npm login` first and enter your credentials
   * Check with `npm publish --dry-run` if all files are included correctly (dist/js/*.js + sass files)
   * Then run `npm publish` and follow the instructions there

- Generate new docs