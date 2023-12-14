import { Command } from 'commander';
import { calculateContributors } from './calculateContributors'; // This will be your custom function

const program = new Command();

program.version('1.0.0').description('CLI to gather metrics on cross collaboration in a git repository');

program
  .command('analyze <repositoryPath>')
  .description('Analyze the specified git repository')
  .action((repositoryPath) => {
    calculateContributors(repositoryPath)
      .then((count: any) => {
        console.log(`Number of contributors who worked on multiple projects: ${count}`);
      })
      .catch((error: any) => {
        console.error('Error:', error.message);
      });
  });

program.parse(process.argv);
