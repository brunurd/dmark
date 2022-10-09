const mockArgv = require('mock-argv');
const { parseArgv } = require('./cli');

const cliConfig = {
  validFlags: [
    {
      name: 'foo-flag',
      description: 'A foo flag.',
    },
    {
      name: 'bar-flag',
      shortCut: 'b',
      description: 'A bar flag.',
    },
    {
      name: 'baz-flag',
      shortCut: 'z',
      description: 'A baz flag.',
    },
  ], validOptions: [
    {
      name: '--foo-opt',
      description: 'A foo option.',
    },
    {
      name: 'bar-opt',
      shortCut: 'a',
      description: 'A bar option.',
    },
    {
      name: 'baz-opt',
      description: 'A baz option.',
    },
  ],
};

describe('parseArgv function', () => {
  it('should cmd be the first item in argv', () => {
    const argv = 'apply foo bar'.split(' ');
    let cliResult = null;

    mockArgv(argv, () => {
      cliResult = parseArgv(cliConfig);
    });

    expect(cliResult.cmd).toBe('apply');
  });

  it('should return flags correct and valid values passed through argv', () => {
    const argv = 'test --foo-flag -b --ted-flag'.split(' ');
    let cliResult = null;

    mockArgv(argv, () => {
      cliResult = parseArgv(cliConfig);
    });

    expect(cliResult.flags['foo-flag']).toBe(true);
    expect(cliResult.flags['bar-flag']).toBe(true);
    expect(cliResult.flags['baz-flag']).toBe(false);
    expect(cliResult.flags['ted-flag']).toBe(undefined);
  });

  it('should return options correct and valid values passed through argv', () => {
    const argv = 'do --foo-opt hey --foo-opt joe -a hello --ted-opt world'.split(' ');
    let cliResult = null;

    mockArgv(argv, () => {
      cliResult = parseArgv(cliConfig);
    });

    expect(cliResult.options['--foo-opt']).toStrictEqual(['joe', 'hey']);
    expect(cliResult.options['bar-opt']).toStrictEqual(['hello']);
    expect(cliResult.options['baz-opt']).toStrictEqual([]);
    expect(cliResult.options['ted-opt']).toBe(undefined);
  });

  it('should return rest args in argv when they are not in valid config', () => {
    const argv = 'dmark --foo-opt hey --foo-opt joe --foo-flag -b --ted-flag -a hello --ted-opt world'.split(' ');
    let cliResult = null;

    mockArgv(argv, () => {
      cliResult = parseArgv(cliConfig);
    });

    expect(cliResult.rest).toStrictEqual(['--ted-flag', '--ted-opt', 'world']);
  });
});
