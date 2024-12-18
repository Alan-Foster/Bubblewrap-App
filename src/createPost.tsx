import { Devvit, useState } from '@devvit/public-api';

Devvit.addMenuItem({
  label: 'Add a Bubblewrap Game',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui, redis } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Bubblewrap for Everyone!',
      subredditName: subreddit.name,
	  textFallback: { text: 'This content is only available on New Reddit. Please visit r/Bubbles to learn more!' },
      preview: (
        <vstack height="100%" width="100%" alignment="middle center" backgroundColor="neutral-background">
          <hstack 
            height="128px" 
            width="128px" 
            backgroundColor="#FFFFFF" 
            cornerRadius="full" 
            alignment="center middle"
          >
            <image url="https://i.redd.it/ubqroqo60c7e1.gif" imageWidth={100} imageHeight={100} />
          </hstack>
          <spacer size="small" />
          <text size="xlarge" color="secondary">Loading Bubblewrap...</text>
        </vstack>
      ),
    });

    // Store the post ID in Redis
    await redis.set(`bubblewrap_post:${post.id}`, JSON.stringify({
      data: new Array(48).fill(0), // Assuming 48 bubbles (6x8)
      clicked: new Array(48).fill(false),
      poppedCount: 0
    }));

    ui.showToast({ text: 'Bubblewrap Custom Post Created!' });
    ui.navigateTo(post);
  },
});