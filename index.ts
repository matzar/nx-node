import { Command } from 'commander';
import { calculateContributors } from './calculateContributors';

const program = new Command();

program.version('1.0.0').description('CLI to gather metrics on cross collaboration in a git repository');

program
  .command('analyze <repositoryPath>')
  .description('Analyze the specified git repository')
  .option('-n, --num-commits <number>', 'Number of commits to analyze in each subfolder', '100')
  .action((repositoryPath, options) => {
    calculateContributors(repositoryPath, options.numCommits)
      .then((count: any) => {
        console.log(`Number of contributors who worked on multiple projects: ${count}`);
      })
      .catch((error: any) => {
        console.error('Error:', error.message);
      });
  });

program.parse(process.argv);
