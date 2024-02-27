import { Devvit } from '@devvit/public-api';

export function addBubblewrapMenuItem() {
  Devvit.addMenuItem({
    label: 'Add a Bubblewrap Game',
    location: 'subreddit',
    forUserType: 'moderator',
    onPress: async (_event, context) => {
      const { reddit, ui } = context;
      const subreddit = await reddit.getCurrentSubreddit();
      await reddit.submitPost({
        title: 'Bubblewrap for Everyone!',
        subredditName: subreddit.name,
        preview: (
          <vstack height="100%" width="100%" alignment="middle center" backgroundColor="#000000">
            <text size="large">Loading ...</text>
          </vstack>
        ),
      });
      ui.showToast({ text: 'Bubblewrap Custom Post Created!' });
    },
  });
}
