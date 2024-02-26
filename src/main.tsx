import { Devvit } from '@devvit/public-api'

Devvit.configure({
  redditAPI: true,
});

import { addBubblewrapMenuItem } from '/addBubblewrapMenuItem';
addBubblewrapMenuItem();

const resolution = 10;
const size = 32;
const colors = ["#FFFFFF","#d7e5fc"]; // Adds white and light blue as primary bubblewrap colors
const blankCanvas = new Array(resolution * resolution).fill(0);
const clickedBoxes = new Array(resolution * resolution).fill(false);

Devvit.addCustomPostType({
  name: 'Bubblewrap',
  render: context => {
    const { useState } = context;
    const [data, setData] = useState(blankCanvas);
    const [clicked, setClicked] = useState(clickedBoxes);

    const pixels = data.map((pixel, index) => (
      <vstack // Parent container to handle the click
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
      >
        <hstack // Child with rounded corners for visual effect
          height="100%"
          width="100%"
          backgroundColor={clicked[index] ? colors[1] : colors[0]} //Sets background colors of bubbles depending on state
          cornerRadius="medium"
          alignment="center middle"
        >
          {clicked[index] && (
            <text color="black" weight="bold" size="medium">
              Pop!
            </text>
          )}
        </hstack>
      </vstack>
    ));

    const height = resolution * size;
    const width = Math.round(height);
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
        backgroundColor="#d7e5fc" // The color of the bubblewrap spaces outside bubbles (constant color)
      >
        {splitArray(pixels, resolution).map((row, rowIndex) => (
          <hstack key={rowIndex}>{row}</hstack>
        ))}
      </vstack>
    );

    return (
      <blocks>
        <vstack gap="small" width="100%" height="100%" alignment="center" backgroundColor="transparent">
          <vstack backgroundColor="#888888" padding="small" cornerRadius="medium">
            <text color="white" weight="bold" size="medium">Click Below to Play with Bubblewrap!</text>
          </vstack>
          <Canvas />
        </vstack>
      </blocks>
    )
  }
})

export default Devvit;