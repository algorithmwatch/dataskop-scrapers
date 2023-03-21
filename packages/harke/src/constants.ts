// https://techpostplus.com/youtube-video-categories-list-faqs-and-solutions/
// https://outofthe925.com/do-youtube-categories-matter/

const categories = [
  { de: 'Film & Animation', en: 'Film & Animation', id: 1 },
  { de: 'Autos & Fahrzeuge', en: 'Autos & Vehicles', id: 2 },
  { de: 'Musik', en: 'Music', id: 10 },
  { de: 'Tiere & Sport', en: 'Music', id: 15 },
  { de: 'Reisen & Events', en: 'Travel & Events', id: 19 },
  { de: 'Gaming', en: 'Gaming', id: 20 },
  { de: 'Menschen & Blogs', en: 'People & Blogs', id: 22 },
  { de: 'Comedy', en: 'Comedy', id: 23 },
  { de: 'Unterhaltung', en: 'Entertainment', id: 24 },
  { de: 'Nachrichten & Politik', en: 'News & Politics', id: 25 },
  { de: 'Praktische Tipps & Styling', en: 'Howto & Style', id: 26 },
  { de: 'Bildung', en: 'Education', id: 27 },
  { de: 'Wissenschaft & Technik', en: 'Science & Technology', id: 28 },
  { de: 'Soziales Engagement', en: 'Nonprofits & Activism', id: 29 },
];

// https://www.youtube.com/newucnews

const newsPlaylists = {
  de: [
    {
      label: 'News / Nachrichten',
      id: 'PL3ZQ5CpNulQnRmIg0qmrmA-Q8VTLVJNmp',
    },
    {
      label: 'National News / Nationale Nachrichten',
      id: 'PLNjtpXOAJhQJYbpJxMnoLKCUPanyEfv_j',
    },
    {
      label: 'Sports News / Sportnachrichten',
      id: 'PL4Yp_5ExVAU2cZMOl2we9ArKj7FiNhPGw',
    },
    {
      label: 'Entertainment News / Unterhaltungsnachrichten',
      id: 'PLivYonEKHnxz0k2KP8IybytVIykYJK6R4',
    },
    {
      label: 'Business News / Wirtschaftsmeldungen',
      id: 'PLQ3HMgwndlsXYLmN7jEl7JEnjmttNIPjP',
    },
    {
      label:
        'Science and Technology News / Meldungen aus Wissenschaft und Technik',
      id: 'PLZ3fbv488-iVNNpXJVGcgv_V4uIXtNSyV',
    },
    {
      label: 'World News / Internationale Nachrichten',
      id: 'PLr1-FC1l_JLGXEng-eiHjcYzv7fJ6giGL',
    },
    {
      label: 'Health News / Gesundheitsnachrichten',
      id: 'PLG3wws6vwyGOxK7vHMDAiAvTm9PnSRJ7T',
    },
  ],
};

const specialPlaylists = {
  popular: 'PLrEnWoR732-BHrPp_Pm8_VleD68f9s14-',
  likedVides: 'LL',
};

export { categories, newsPlaylists, specialPlaylists };
