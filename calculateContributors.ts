import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';

export async function calculateContributors(repositoryPath: string, numCommits: string = '100'): Promise<number> {
  try {
    const git: SimpleGit = simpleGit(repositoryPath);

    // Check if 'packages' directory exists
    const packagesPath = path.join(repositoryPath, 'packages');
    if (!fs.existsSync(packagesPath) || !fs.statSync(packagesPath).isDirectory()) {
      throw new Error("'packages' directory does not exist in the repository.");
    }

    let contributors = new Map<string, number>();
    const subfolders = fs
      .readdirSync(packagesPath)
      .filter((folder) => fs.statSync(path.join(packagesPath, folder)).isDirectory());

    for (const folder of subfolders) {
      const folderPath = `packages/${folder}`;
      const logOptions = ['-n', numCommits, '--', folderPath];
      const log = await git.log(logOptions);
      log.all.forEach((commit) => {
        const contributor = commit.author_name;
        contributors.set(contributor, (contributors.get(contributor) || 0) + 1);
      });
    }

    let multiProjectContributors = 0;
    contributors.forEach((count) => {
      if (count > 1) multiProjectContributors++;
    });

    await updateReadme(repositoryPath, multiProjectContributors);
    return multiProjectContributors;
  } catch (error: any) {
    // Handle or throw the error
    console.error('Error:', error.message);
    throw error; // or return a default value
  }
}

async function updateReadme(repositoryPath: string, count: number): Promise<void> {
  const readmePath = path.join(repositoryPath, 'README.md');
  let readmeContent = '';

  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  }

  const metricsSection = `## Contributor Metrics\nNumber of contributors who worked on multiple projects: ${count}\n`;

  // Check if the section already exists and update it, or append a new section
  if (readmeContent.includes('## Contributor Metrics')) {
    readmeContent = readmeContent.replace(/## Contributor Metrics[\s\S]*/, metricsSection);
  } else {
    readmeContent += metricsSection;
  }

  fs.writeFileSync(readmePath, readmeContent);
}
