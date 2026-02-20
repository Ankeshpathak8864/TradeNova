import React from 'react'
function LeftSection({imageURL, 
    productName, 
    productDescription, 
    tryDemo, 
    learnMore, 
    googlePlay, 
    appStore}) {
    return ( 
        <div className="container mt-5">
            <div className="row">
                <div className="col-6 ">
                    <img alt="TradeNova" src={imageURL}  />
                </div>

                 <div className="col-6 p-5 ">
                    <h3>{productName}</h3>
                    <p>{productDescription}</p>
                    <div>
                        <a href={tryDemo}>Try Demo</a>
                        <a href={learnMore} style={{marginLeft:"50px"}}>Learn More</a>
                    </div>
                   
                   <div className='mt-3'>
                     <a href={googlePlay}><img alt="TradeNova" src="/media/images/googlePlayBadge.svg" /></a>
                    <a href={appStore} style={{marginLeft:"50px"}}><img alt="TradeNova" src="/media/images/appstoreBadge.svg" /></a>
                   </div>
                 </div>
            </div>
        </div>
     );
}

export default LeftSection;