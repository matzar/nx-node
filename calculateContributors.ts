import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';

export async function calculateContributors(repositoryPath: string): Promise<number> {
  const git: SimpleGit = simpleGit(repositoryPath);
  let contributors = new Map<string, number>();

  const packagesPath = path.join(repositoryPath, 'packages');
  const subfolders = fs
    .readdirSync(packagesPath)
    .filter((folder) => fs.statSync(path.join(packagesPath, folder)).isDirectory());

  for (const folder of subfolders) {
    const folderPath = `packages/${folder}`; // Adjusted path format
    const log = await git.log([folderPath]);
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
