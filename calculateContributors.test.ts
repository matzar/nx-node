import { calculateContributors } from './calculateContributors';
import fs from 'fs';

// Mock simple-git and fs
jest.mock('simple-git', () => {
  // Mock the behavior of simple-git
  return () => ({
    log: jest.fn().mockResolvedValue({
      all: [{ author_name: 'User1' }, { author_name: 'User2' }],
    }),
  });
});

jest.mock('fs', () => ({
  // Mock the behavior of fs
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue('Existing README content'),
  writeFileSync: jest.fn(),
  readdirSync: jest.fn().mockReturnValue(['folderA', 'folderB']),
  statSync: jest.fn().mockReturnValue({ isDirectory: () => true }),
}));

describe('calculateContributors', () => {
  it('should return the correct number of multi-project contributors', async () => {
    const count = await calculateContributors('valid/path');
    expect(count).toBe(2); // Adjust based on your mock data
  });

  it('should handle non-existent repository gracefully', async () => {
    // Adjust the mock to simulate a non-existent repository
    jest.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('Invalid repository path');
    });

    await expect(calculateContributors('invalid/path')).rejects.toThrow('Invalid repository path');
  });

  // Additional tests can be written for checking the README update, etc.
});
