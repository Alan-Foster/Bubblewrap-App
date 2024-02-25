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
      preview: (
        <vstack height="100%" width="100%" alignment="middle center" backgroundColor="#000000">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Bubblewrap Custom Post Created!' });
  },
});

const resolution = 12;
const size = 24; // Adjust size if necessary
const colors = ["#FFFFFF","#d7e5fc"]; // Adds white and light blue as primary bubble wrap colors
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
        backgroundColor={clicked[index] ? colors[0] : colors[1]}
        alignment="middle center"
        cornerRadius="small"
      >
        {clicked[index] && (
          <text color="black" weight="bold" size="xsmall">
            Pop!
          </text>
        )}
      </hstack>
    ));

    const height = resolution * size;
    const width = Math.round(height * 1);
    const gridSizeWidth = `${width}px`;
    const gridSizeHeight = `${height}px`;

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
        height={gridSizeHeight}
        width={gridSizeWidth}
        backgroundColor="#d7e5fc" // Set the canvas background to light blue, same as unclicked boxes
      >
        {splitArray(pixels, resolution).map((row, rowIndex) => (
          <hstack key={rowIndex}>{row}</hstack>
        ))}
      </vstack>
    );
    
    return (
      <blocks>
        <vstack gap="small" width="100%" height="100%" alignment="center middle" backgroundColor="#555555">
          <text color="white" weight="bold" size="medium">Click Below to Play with Bubblewrap!</text>
          <Canvas />
        </vstack>
      </blocks>
    )
  }
})

export default Devvit;