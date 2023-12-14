import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';

/**
 * Calculates the number of contributors who have contributed to multiple subprojects within a repository.
 *
 * @param {string} repositoryPath - The file path to the local Git repository.
 * @param {string} numCommits - The number of recent commits to analyze in each subfolder (default is '100').
 * @returns {Promise<number>} A promise that resolves to the number of contributors who worked on multiple projects.
 */
export async function calculateContributors(repositoryPath: string, numCommits: string = '100'): Promise<number> {
  try {
    // Initialize simpleGit with the provided repository path.
    const git: SimpleGit = simpleGit(repositoryPath);

    // Verify existence of the 'packages' directory within the repository.
    const packagesPath = path.join(repositoryPath, 'packages');
    if (!fs.existsSync(packagesPath) || !fs.statSync(packagesPath).isDirectory()) {
      throw new Error("'packages' directory does not exist in the repository.");
    }

    // Map to keep track of contributor commit counts across subfolders.
    let contributors = new Map<string, number>();

    // List and filter subfolders in the 'packages' directory.
    const subfolders = fs
      .readdirSync(packagesPath)
      .filter((folder) => fs.statSync(path.join(packagesPath, folder)).isDirectory());

    // Process each subfolder to count contributor commits.
    for (const folder of subfolders) {
      const folderPath = `packages/${folder}`;
      const logOptions = ['-n', numCommits, '--', folderPath];
      const log = await git.log(logOptions);
      log.all.forEach((commit) => {
        const contributor = commit.author_name;
        contributors.set(contributor, (contributors.get(contributor) || 0) + 1);
      });
    }

    // Count contributors who worked on more than one subfolder.
    let multiProjectContributors = 0;
    contributors.forEach((count) => {
      if (count > 1) multiProjectContributors++;
    });

    // Update the README file with the calculated metrics.
    await updateReadme(repositoryPath, multiProjectContributors);
    return multiProjectContributors;
  } catch (error) {
    // Handle errors, distinguishing between Error instances and other types.
    if (error instanceof Error) {
      console.error('Error:', error.message);
      throw error;
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
}

/**
 * Updates or appends a metrics section in the repository's README.md file.
 *
 * @param {string} repositoryPath - The file path to the local Git repository.
 * @param {number} count - The number of contributors to be documented in the README.
 */
async function updateReadme(repositoryPath: string, count: number): Promise<void> {
  const readmePath = path.join(repositoryPath, 'README.md');
  let readmeContent = '';

  // Read existing README content, if it exists.
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  }

  // Define the section to add or update in the README.
  const metricsSection = `## Contributor Metrics\nNumber of contributors who worked on multiple projects: ${count}\n`;

  // Update or append the metrics section in the README.
  if (readmeContent.includes('## Contributor Metrics')) {
    readmeContent = readmeContent.replace(/## Contributor Metrics[\s\S]*/, metricsSection);
  } else {
    readmeContent += metricsSection;
  }

  // Write the updated content back to the README file.
  fs.writeFileSync(readmePath, readmeContent);
}
