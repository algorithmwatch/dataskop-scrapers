// import * from 'somepath' is not working for default exports

import parseVideoPage from './extractors/parseVideoPage';
import parsePlaylistPage from './extractors/parsePlaylistPage';
import parseSearchHistoryPage from './extractors/parseSearchHistoryPage';
import parseSubscribedChannelsPage from './extractors/parseSubscribedChannelsPage';
import parseWatchHistoryPage from './extractors/parseWatchHistoryPage';

export {
  parseVideoPage,
  parsePlaylistPage,
  parseSearchHistoryPage,
  parseSubscribedChannelsPage,
  parseWatchHistoryPage,
};
