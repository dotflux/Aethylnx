import React from 'react'
import Manager from './Manager'
import TopBar from './TopBar'
import Middle from './Middle'
import GetStarted from './GetStarted'

const Index = () => {
  return (
    <div>
      <Manager />
      <TopBar />
    
      <div className="text-center font-gilroyH animate-fadeIn">
        <span className='my-16 inline-flex animate-text-gradient bg-gradient-to-r from-[#f5f5f7] via-[#78777d] to-[#d8def5] bg-[200%_auto] bg-clip-text text-8xl text-transparent'>
          Aethylnx
        </span>
        
        {/* Add flex container and center it */}
        
      </div>
      
      <Middle /> 
      
    </div>
  );
}

export default Index