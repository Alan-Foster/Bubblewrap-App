import './createPost.js';
import { Devvit, useState, useAsync, useInterval, useChannel, RichTextBuilder } from '@devvit/public-api';

Devvit.configure({ redditAPI: true, redis: true, realtime: true });

const numRows = 6; // Height of the bubbles
const numCols = 8; // Width of the bubbles
const size = 32; // Scale of the canvas, not total number of bubbles
const colors = ["#d7e5fc", "#FFFFFF"];
const totalBubbles = numRows * numCols; // Total number of bubbles
const blankCanvas = new Array(totalBubbles).fill(0);
const clickedBoxes = new Array(totalBubbles).fill(false);

Devvit.addCustomPostType({
  name: 'Bubblewrap',
  render: context => {
    const { postId, redis } = context;
    const [dataState, setDataState] = useState(blankCanvas);
    const [clickedState, setClickedState] = useState(clickedBoxes);
    const [poppedCount, setPoppedCount] = useState(0);
	
	
	// Most of the Realtime Logic is below
	
	const cleanPostId = postId.replace('t3_', ''); // Realtime Channels do not support underscores
    const channelName = `bubblewrap_events_${cleanPostId}`; // Defines the channelName as a valid custom ID
	
	type BubbleWrapMessage = {
	  data: number[];
	  clicked: boolean[];
	  poppedCount: number;
	};

	const channel = useChannel<BubbleWrapMessage>({
	  name: channelName,
      onMessage: (message) => {
        if (message) {
          setDataState(message.data);
          setClickedState(message.clicked);
          setPoppedCount(message.poppedCount);
        }
      },
      onSubscribed: async () => {
        // Fetch the current game state from Redis when the channel is subscribed
        const currentState = await context.redis.get(`bubblewrap_post:${postId}`);
        if (currentState) {
          const parsedState = JSON.parse(currentState);
          setDataState(parsedState.data);
          setClickedState(parsedState.clicked);
          setPoppedCount(parsedState.poppedCount);
        }
      },
      onUnsubscribed: () => {
        console.log('Channel disconnected. Attempting to reconnect...');
        setTimeout(() => channel.subscribe(), 1000);
      },
    });

    channel.subscribe();
	
	// Save the data changes that happen to Redis
	const saveState = async (state: BubbleWrapMessage) => {
      await context.redis.set(`bubblewrap_post:${postId}`, JSON.stringify(state));
    };
	
	
	// End of most of the Realtime logic

	
	// Reset functionality (renamed to Refresh because it doesn't reset score, only bubbles)
    const resetBubbles = async () => {
      const resetData = { 
	    data: [...blankCanvas], 
		clicked: [...clickedBoxes], 
		poppedCount: poppedCount }; // set to poppedCount: 0 if you want to reset the total on refresh
      setDataState(resetData.data);
      setClickedState(resetData.clicked);
      // setPoppedCount(resetData.poppedCount); // Reactivate this line with above to reset totals to 0
      await channel.send(resetData);
      await saveState(resetData);
    };

    // The core bubble popping logic
    const popBubble = async (index: number) => {
      if (!clickedState[index]) {
        const newData = [...dataState];
        newData[index] = 1;
        const newClicked = [...clickedState];
        newClicked[index] = true;
        const newPoppedCount = poppedCount + 1;
        
        const newState = { data: newData, clicked: newClicked, poppedCount: newPoppedCount };
        setDataState(newData);
        setClickedState(newClicked);
        setPoppedCount(newPoppedCount);
        
        await channel.send(newState);
        await saveState(newState);
      }
    };

    // Generate rows of bubbles, printed within the Canvas below
    const rows = Array.from({ length: numRows }).map((_, rowIndex) => {
      const rowBubbles = dataState.slice(rowIndex * numCols, (rowIndex + 1) * numCols).map((pixel, colIndex) => {
        const index = rowIndex * numCols + colIndex;
        return (
          <vstack
            key={index}
            height={`${size}px`}
            width={`${size * 1.16}px`}
          >
			<hstack
			  height="100%"
			  width="100%"
			  onPress={() => popBubble(index)}
			  backgroundColor={clickedState[index] ? colors[1] : colors[0]}
			  cornerRadius="medium"
			  alignment="center middle"
			  
			  hoverStyle={{ backgroundColor: "primary" }}
			  pressStyle={{ backgroundColor: "interactive-pressed" }}
			  
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



	// The actual Bubblewrap Canvas where they appear. Only the middle canvas section
	// Controls the app background as well as the border and bubble ratios
    const Canvas = () => ( 
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


	// The z-stack overlay for the loading gif. Looks like it continues the gif from preview, nice!
    const [showImage, setShowImage] = useState(true);
    // Use useInterval to hide the image after 3 seconds
    const hideImageInterval = useInterval(() => {
      setShowImage(false);
    }, 3000);
    // Start the interval when the component mounts
    hideImageInterval.start();



	// The final returned app with z-stack logo, top data, Canvas, Refresh button, and Audio video
	return (
	  <blocks>
		<zstack width="100%" height="100%">
		  {/* Bubblewrap content */}
		  <vstack width="100%" height="100%" alignment="middle center" padding="small" backgroundColor="transparent">
			<vstack backgroundColor="#d7e5fc" padding="small" cornerRadius="medium">
			  <text color="black" weight="bold" size="medium">
				Total Bubbles Popped: {poppedCount}
			  </text>
			</vstack>
			<spacer size="small" />
			<Canvas />
			<spacer size="small" />
			  <button onPress={resetBubbles} appearance="success" icon="refresh">
			    Refresh Bubbles
			  </button>
			  <spacer size="small" />
		  </vstack>


		  {/* Loading overlay for 3s for logo animation*/}
		  {showImage && (
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
		  )}
		</zstack>
	  </blocks>
	);
  },
});


export default Devvit;

// The video link for the game audio
// https://v.redd.it/v5wj7x1exg7e1