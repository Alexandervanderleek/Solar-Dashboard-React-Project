import React from 'react'
import ReactPlayer from 'react-player'


function VideoPlayer({dataSet}) {
  return (
    <div style={{ display: 'flex',height:'99%', width:'99%', justifyContent: 'center', alignItems: 'center', marginTop: 4}}>
       <ReactPlayer url={dataSet} width={'100%'} height={'100%'} playing={true} muted={true} controls={false} loop={true} />
    </div>
  )
}

export default VideoPlayer
