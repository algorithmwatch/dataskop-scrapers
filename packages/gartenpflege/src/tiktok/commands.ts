import { closeBrowser } from '../browser';
import { getForYouFeed, login } from './get-html';

const commands = async (cli) => {
  let close = true;

  if (cli.flags.login) {
    login(cli.flags);
    close = false;
  }

  if (cli.flags.feed) {
    await getForYouFeed(cli.flags);
  }

  if (close) await closeBrowser();
};

export default commands;
