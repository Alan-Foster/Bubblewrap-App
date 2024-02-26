import { Devvit } from '@devvit/public-api'

Devvit.configure({
  redditAPI: true,
});

import { addBubblewrapMenuItem } from './addBubblewrapMenuItem';
addBubblewrapMenuItem();

const resolution = 10;
const size = 32;
const colors = ["#FFFFFF","#d7e5fc"]; // Adds white and light blue as primary bubblewrap colors
const blankCanvas = new Array(resolution * resolution).fill(0);
const clickedBoxes = new Array(resolution * resolution).fill(false);

Devvit.addCustomPostType({
  name: 'Bubblewrap',
  // height: 'tall' // Temporarily disabled Tall height because it doesn't function on Desktop
  render: context => {
    const { useState } = context;
    const [data, setData] = useState(blankCanvas);
    const [clicked, setClicked] = useState(clickedBoxes);

    const resetBubbles = () => {
      setData([...blankCanvas]);
      setClicked([...clickedBoxes]);
    };

    const pixels = data.map((pixel, index) => (
      <vstack
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
        width={`${size * 1.16}px`} // Problem with overflow of "Pop!" text workaround increasing width
      >
        <hstack
          height="100%"
          width="100%"
          backgroundColor={clicked[index] ? colors[1] : colors[0]}
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
        backgroundColor="#d7e5fc"
      >
        {splitArray(pixels, resolution).map((row, rowIndex) => (
          <hstack key={rowIndex}>{row}</hstack>
        ))}
      </vstack>
    );

    return (
      <blocks>
        <vstack gap="small" width="100%" height="100%" alignment="center" backgroundColor="transparent">
          <vstack backgroundColor="#d7e5fc" padding="small" cornerRadius="medium">
            <text color="black" weight="bold" size="medium">
              Click Below to Play with Bubblewrap!
            </text>
          </vstack>
          <Canvas />
          {/* Reset Button */}
          <button onPress={resetBubbles}>
            Reset Bubbles
          </button>
        </vstack>
      </blocks>
    )
  }
})

export default Devvit;