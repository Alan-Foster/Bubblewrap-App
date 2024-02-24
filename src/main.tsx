import { Devvit } from '@devvit/public-api'

Devvit.configure({
  redditAPI: true,
});

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
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
  },
});

const resolution = 12;
const size = 22;
const colors = ["#000000","#FFFFFF",];
const blankCanvas = new Array(resolution * resolution).fill(0);
const clickedBoxes = new Array(resolution * resolution).fill(false);

Devvit.addCustomPostType({
  name: 'Bubblewrap',
  render: context => {
    const { useState } = context;
    const [data, setData] = useState(blankCanvas);
    const [clicked, setClicked] = useState(clickedBoxes);
    const pixels = data.map((pixel, index) => (
      <hstack
        key={index}
        onPress={() => {
          const newData = [...data];
          newData[index] = 1;
          setData(newData);
          const newClicked = [...clicked];
          newClicked[index] = true;
          setClicked(newClicked);
        }}
        height={`${size}px`}
        width={`${size}px`}
        backgroundColor={clicked[index] ? colors[1] : colors[0]}
        alignment="middle center"
      >
        {clicked[index] && (
          <text color="black" weight="bold" size="xsmall">
            Pop!
          </text>
        )}
      </hstack>
    ));

    const gridSize = `${resolution * size}px`;

    function splitArray<T>(array: T[], segmentLength: number): T[][] {
      const result: T[][] = [];
      for (let i = 0; i < array.length; i += segmentLength) {
        result.push(array.slice(i, i + segmentLength));
      }
      return result;
    }

    const Canvas = () => (
      <vstack
        cornerRadius="small"
        border="thin"
        height={gridSize}
        width={gridSize}
      >
        {splitArray(pixels, resolution).map((row, rowIndex) => (
          <hstack key={rowIndex}>{row}</hstack>
        ))}
      </vstack>
    );
    
    return (
      <blocks>
        <vstack gap="small" width="100%" height="100%" alignment="center middle">
          <Canvas />
        </vstack>
      </blocks>
    )
  }
})

export default Devvit;