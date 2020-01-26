import childProcess from 'child_process';
import { promisify } from 'util';

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
export default async function exec(command: string, params: string): Promise<any> {
  const ex = promisify(childProcess.exec);
  try {
    const res = await ex(`${__dirname}/../build/cmd ${command} ${params}`);
    return JSON.parse(res.stdout);
  } catch (err) {
    const { stdout } = err;
    const responseError: { Err: string, Message: string } = JSON.parse(stdout);
    throw new GoExecError(responseError.Err, responseError.Message);
  }
}
