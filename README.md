# Git Collaboration Metrics CLI Tool

This CLI tool is designed to analyze Git repositories to determine the level of cross-collaboration across different projects. It specifically counts the number of contributors who have made commits to multiple subprojects within a repository.

## Features

- Analyze any Git repository on your local machine.
- Count contributors who have worked on multiple subprojects within the 'packages' directory of the repository.
- Update or add a metrics section in the repository's README.md file with the count of such contributors.
- Customizable depth of commit analysis using command-line options.

## Installation

Before installing, ensure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your system.

1. Clone this repository:

   ```bash
   git clone https://github.com/matzar/nx-node
   ```

2. Navigate to the cloned directory:

   ```bash
   cd nx-node
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Build the project with `esbuild`:

   ```bash
   npm run build
   ```

   This will create a bundled and minified JavaScript file `cli.js`.

## Usage

To use the CLI tool, run the following command in your terminal:

```bash
node cli.js analyze <repositoryPath> [options]
```

### Arguments

- `repositoryPath`: The path to the local Git repository you want to analyze.

### Options

- `-n, --num-commits <number>`: Specify the number of recent commits to analyze in each subproject. Default is 100.

### Examples

```bash
node cli.js analyze ./count-contributors-sample/ -n 1
# Output: Number of contributors who worked on multiple projects: 0
```

This command analyzes the repository located at `./count-contributors-sample/`, considering the last 1 commit of each subproject in the 'packages' directory.

```bash
node cli.js analyze ./count-contributors-sample/ -n 2
# Output: Number of contributors who worked on multiple projects: 2
```

This command analyzes the repository located at `./count-contribitors-sample/`, considering the last 2 commits of each subproject in the 'packages' directory.

```bash
node cli.js analyze ./my-repo/ --num-commits 50
# Output: Number of contributors who worked on multiple projects: 2
```

This command analyzes the repository located at `./my-repo`, considering the last 50 commits of each subproject in the 'packages' directory.

## Output

After running the analysis, the tool outputs the number of contributors who worked on multiple projects in the console. Additionally, it updates the repository's README.md file with a section titled "Contributor Metrics," showing this count.

## Contributing

Contributions to this project are welcome. Please ensure to update tests as appropriate.

## License

[ISC](https://opensource.org/licenses/ISC)
