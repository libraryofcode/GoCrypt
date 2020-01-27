import childProcess from 'child_process';

class GoExecError extends Error {
  public goErr: string;

  public goMsg: string;

  constructor(err: string, message: string) {
    super(err);

    this.name = this.constructor.name;
    this.goErr = err;
    this.goMsg = message;
  }
}
export default function exec(command: string, args = [], stdin = ''): any {
  try {
    const res = childProcess.execSync(`${__dirname}/../build/cmd ${command} ${args.join(' ')}`, { input: stdin, encoding: 'utf8' });
    return JSON.parse(res.toString());
  } catch (err) {
    const stdout = err.stdout.toString();
    const responseError: { Err: string, Message: string } = JSON.parse(stdout);
    throw new GoExecError(responseError.Err, responseError.Message);
  }
}
