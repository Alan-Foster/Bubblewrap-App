import { Devvit } from '@devvit/public-api'

Devvit.configure({
  redditAPI: true,
});

import { addBubblewrapMenuItem } from './addBubblewrapMenuItem';
addBubblewrapMenuItem();

const numRows = 6; // Height of the bubbles
const numCols = 9; // Width of the bubbles
const size = 32;
const colors = ["#d7e5fc", "#FFFFFF"];
const totalBubbles = numRows * numCols;
const blankCanvas = new Array(totalBubbles).fill(0);
const clickedBoxes = new Array(totalBubbles).fill(false);

Devvit.addCustomPostType({
  name: 'Bubblewrap',
  render: context => {
    const { useState } = context;
    const [data, setData] = useState(blankCanvas);
    const [clicked, setClicked] = useState(clickedBoxes);
    const [poppedCount, setPoppedCount] = useState(0);

    const resetBubbles = () => {
      setData([...blankCanvas]);
      setClicked([...clickedBoxes]);
      setPoppedCount(0); // Reset the popped counter
    };

    // Generate rows of bubbles
    const rows = Array.from({ length: numRows }).map((_, rowIndex) => {
      const rowBubbles = data.slice(rowIndex * numCols, (rowIndex + 1) * numCols).map((pixel, colIndex) => {
        const index = rowIndex * numCols + colIndex; // Calculate the absolute index
        return (
          <vstack
            key={index}
            onPress={() => {
              if (!clicked[index]) {
                const newData = [...data];
                newData[index] = 1;
                setData(newData);

                const newClicked = [...clicked];
                newClicked[index] = true;
                setClicked(newClicked);

                setPoppedCount(poppedCount + 1);
              }
            }}
            height={`${size}px`}
            width={`${size * 1.16}px`} // Adjusted width for "Pop!" visibility
          >
            <hstack
              height="100%"
              width="100%"
              backgroundColor={clicked[index] ? colors[1] : colors[0]}
              cornerRadius="medium"
              alignment="center middle"
            >
              {clicked[index] && (
                <text color="black" weight="bold" size="medium">Pop!</text>
              )}
            </hstack>
          </vstack>
        );
      });

      return (
        <hstack key={rowIndex} width="100%" spacing="0px">
          {rowBubbles}
        </hstack>
      );
    });

    const Canvas = () => ( // Controls the app background as well as the border
      <vstack
        cornerRadius="small"
        border="thick"
        height={`${numRows * size * 1.02}px`}
        width={`${numCols * size * 1.17}px`}
        backgroundColor="#FFFFFF"
      >
        {rows}
      </vstack>
    );

    return (
      <blocks>
        <vstack gap="0px" width="100%" height="100%" alignment="center" backgroundColor="transparent">
          <vstack backgroundColor="#d7e5fc" padding="small" cornerRadius="medium">
            <text color="black" weight="bold" size="medium">
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