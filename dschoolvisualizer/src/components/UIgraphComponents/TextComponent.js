import React from 'react'

//Function that returns a text display
//Based on dataset provided to function


function TextComponent({dataSet}) {
  return (
    <div style={{ display: 'flex',height:'99%', width:'99%', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'gray', borderRadius: 8, marginTop: 2}}>
        <div className='text-4xl font-bold w-10/12 leading-20'>
            {dataSet}
        </div>
    </div>
  )
}

export default TextComponent
