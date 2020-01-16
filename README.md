# Conestoga Robotics page statickifier!
This project downloads pages from a backend and stores them as static pages, such as for GitLab Pages.

## Setup
Edit `./config.js` to specify which files to download or copy. Edit the properties of the `module.exports`
object to edit the settings.

| Property                             | Description                                                         |
|--------------------------------------|---------------------------------------------------------------------|
| `dirTarget`: *`string`*              | Path to the directory to which the files should be downloaded       |
| `copyPairs`: *`string[][]`*          | Array of [*local file/directory path*, *copy destination*] pairings |
| `downloadQueryPairs`: *`string[][]`* | Array of [*server file location*, *download destination*] pairings  |

Add or edit `./config.bat` to set SSH and Git settings.

| Variable    | Description                                          |
|-------------|------------------------------------------------------|
| `ssh_url`   | The Git SSH URL of the target repository             |
| `email`     | The email to be supplied to Git                      |
| `name`      | The name to be supplied to Git                       |
| `commitmsg` | The commit message to be used when committing to Git |

Dependencies are not included with this source code. Use `npm install` to download the dependencies.

## Downloading
1. Clear the current static directory. `npm run clear` (may have to be run multiple times)
2. Pull the files from a target repository. `.\git-get.bat`
3. Delete the files to be replaced. (Any existing files that share a name with a target file will be skipped by the downloader, not overwritten)
4. Start the server of the page. (Avoid running using nodemon, it will cause higher rates of ECONNRESETs)
5. Download the wanted files. `npm run download` (may have to be run multiple times. If there is an ECONNRESET error, simply run again)
6. Make any needed changes to the static files.
7. Track the files and push them to the repository. `.\git-post.bat`

## Other scripts
Use `.git-undolast.bat` to undo the last pushed commit, while retaining changes locally.