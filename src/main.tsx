import { Devvit } from '@devvit/public-api'

Devvit.configure({
  redditAPI: true,
});

import { addBubblewrapMenuItem } from './addBubblewrapMenuItem';
addBubblewrapMenuItem();

Devvit.configure({
  redditAPI: true,
});

const resolution = 10;
const size = 32;
const colors = ["#FFFFFF","#d7e5fc"];
const blankCanvas = new Array(resolution * resolution).fill(0);
const clickedBoxes = new Array(resolution * resolution).fill(false);

Devvit.addCustomPostType({
  name: 'Bubblewrap',
  height: 'tall', // Temporarily disabled Tall height because it doesn't function on Desktop
  render: context => {
    const { useState } = context;
    const [data, setData] = useState(blankCanvas);
    const [clicked, setClicked] = useState(clickedBoxes);
    // Initialize the popped counter state
    const [poppedCount, setPoppedCount] = useState(0);

    const resetBubbles = () => {
      setData([...blankCanvas]);
      setClicked([...clickedBoxes]);
      setPoppedCount(0); // Reset the popped counter
    };

    const pixels = data.map((pixel, index) => (
      <vstack
        key={index}
        onPress={() => {
          const newData = [...data];
          const newClicked = [...clicked];
          // Only increment if the bubble hasn't been popped yet
          if (!newClicked[index]) {
            setPoppedCount(poppedCount + 1);
          }
          newData[index] = 1;
          setData(newData);
          newClicked[index] = true;
          setClicked(newClicked);
        }}
        height={`${size}px`}
        width={`${size * 1.16}px`}
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

    const height = resolution * size * 1.01;
    const width = Math.round(height * 1.15);
    const gridSizeWidth = `${width * 1.00}px`;
    const gridSizeHeight = `${height * 0.70}px`;

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
          {/* Display the popped counter */}
          <text color="black" size="medium">
            Bubbles Popped: {poppedCount}
          </text>
          </vstack>
          <Canvas />
          <button onPress={resetBubbles}>
            Reset Bubbles
          </button>
        </vstack>
      </blocks>
    )
  }
})

export default Devvit;