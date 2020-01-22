/* eslint-disable no-console */
import os from 'os';
import { execSync } from 'child_process';
import * as structs from './structs';
import * as classes from './classes';

/**
 * Checks system information and determines if the user can run GoCrypto.
 * Go must be installed on the machine, and said machine has to be Linux. GoCrypto is not supported
 * on any other operating system but Linux.
 */
function checkRequirements(): { osCheck: boolean, goCheck: boolean } {
  const res = { osCheck: true, goCheck: true };
  if (os.platform() !== 'linux') {
    res.osCheck = false;
  }
  const goStatus = () => {
    try {
      execSync('go version');
      return true;
    } catch (error) {
      return false;
    }
  };
  const goCheck = goStatus();
  if (!goCheck) {
    res.goCheck = false;
  }
  return res;
}

/* Runs checks, throws errors if any of the checks return false.
If any check returns false, the thrown error will prevent the module from being required/imported.
*/
const check = checkRequirements();
if (!check.osCheck) throw new Error('GoCrypt is only supported on Linux operating systems at this time.');
if (!check.goCheck) throw new Error('GoCrypt requires the Go programming language to be installed and available in path.');
export default {
  keys: new classes.Keys(),
};
