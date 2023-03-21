import {
  closeBrowser,
  getLikedVideo,
  getSearchHistory,
  getSearchVideoPage,
  getSubscribedChannels,
  getVideoPage,
  getWatchHistory,
  loginYoutube,
} from './get-html';
import { monitorDeNews } from './monitor';

const commands = async (cli) => {
  let close = true;

  if (cli.flags.login) {
    loginYoutube();
    close = false;
  }

  if (cli.flags.all || cli.flags.watchHistory) {
    await getWatchHistory(cli.flags.outputLocation);
  }

  if (cli.flags.all || cli.flags.searchHistory) {
    const res = await getSearchHistory(cli.flags.outputLocation);
    for (const x of res.fields.queries) {
      console.log(x);
    }
  }

  if (cli.flags.all || cli.flags.subscribedChannels) {
    await getSubscribedChannels(cli.flags.outputLocation);
  }

  if (cli.flags.all || cli.flags.likedVideos) {
    await getLikedVideo(cli.flags.outputLocation);
  }

  if (cli.flags.all || cli.flags.video != null) {
    await getVideoPage(
      cli.flags.video ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      cli.flags.outputLocation,
    );
  }

  if (cli.flags.all || cli.flags.searchVideos != null) {
    await getSearchVideoPage(
      cli.flags.searchVideos ?? 'antifa',
      cli.flags.outputLocation,
    );
  }

  if (cli.flags.monitor) {
    close = true;
    await monitorDeNews(cli.flags.dbLocation);
  }

  if (close) await closeBrowser();
};

export default commands;
