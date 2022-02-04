import { closeBrowser } from '../browser';
import { login } from './get-html';

const commands = async (cli) => {
  let close = true;

  console.log(cli.flags.login);

  if (cli.flags.login) {
    login(cli.flags.credentials, { headless: cli.flags.headless });
    close = false;
  }

  if (close) await closeBrowser();
};

export default commands;
