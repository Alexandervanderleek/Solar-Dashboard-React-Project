import React from 'react'
import ReactPlayer from 'react-player'

//Function that returns a video player object 
//Based on dataset provided to function

function VideoPlayer({dataSet}) {
  return (
    <div style={{ display: 'flex',height:'99%', width:'99%', justifyContent: 'center', alignItems: 'center', padding: 4}}>
       <ReactPlayer url={dataSet} width={'100%'} height={'100%'} playing={true} muted={true} controls={false} loop={true} style={{borderWidth: 4, borderColor: 'gray', borderRadius: 8}} />
    </div>
  )
}

export default VideoPlayer
