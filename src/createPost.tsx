import { Devvit } from '@devvit/public-api';

Devvit.addMenuItem({
  label: 'Add a Bubblewrap Game',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Bubblewrap for Everyone!',
      subredditName: subreddit.name,
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Bubblewrap Custom Post Created!' });
    ui.navigateTo(post);
  },
});
