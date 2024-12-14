import './createPost.js';
import { Devvit, useState, useAsync, useChannel } from '@devvit/public-api';

Devvit.configure({ redditAPI: true, realtime: true });

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
    const [dataState, setDataState] = useState(blankCanvas);
    const [clickedState, setClickedState] = useState(clickedBoxes);
    const [poppedCount, setPoppedCount] = useState(0);

    const channel = useChannel({
      name: 'bubblewrap_events',
      onMessage: (message) => {
        setDataState(message.data);
        setClickedState(message.clicked);
        setPoppedCount(message.poppedCount);
      },
    });

    channel.subscribe();

    const resetBubbles = async () => {
      const resetData = { data: [...blankCanvas], clicked: [...clickedBoxes], poppedCount: 0 };
      setDataState(resetData.data);
      setClickedState(resetData.clicked);
      setPoppedCount(resetData.poppedCount);
      await channel.send(resetData);
    };

    // Update the bubble popping logic
    const popBubble = async (index) => {
      if (!clickedState[index]) {
        const newData = [...dataState];
        newData[index] = 1;
        setDataState(newData);

        const newClicked = [...clickedState];
        newClicked[index] = true;
        setClickedState(newClicked);

        const newPoppedCount = poppedCount + 1;
        setPoppedCount(newPoppedCount);

        await channel.send({ data: newData, clicked: newClicked, poppedCount: newPoppedCount });
      }
    };

    // Generate rows of bubbles
    const rows = Array.from({ length: numRows }).map((_, rowIndex) => {
      const rowBubbles = dataState.slice(rowIndex * numCols, (rowIndex + 1) * numCols).map((pixel, colIndex) => {
        const index = rowIndex * numCols + colIndex;
        return (
          <vstack
            key={index}
            onPress={() => popBubble(index)}
            height={`${size}px`}
            width={`${size * 1.16}px`}
          >
            <hstack
              height="100%"
              width="100%"
              backgroundColor={clickedState[index] ? colors[1] : colors[0]}
              cornerRadius="medium"
              alignment="center middle"
            >
              {clickedState[index] && (
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
              This Bubblewrap Belongs to username.
            </text>
          </vstack>
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
    );
  },
});

export default Devvit;
