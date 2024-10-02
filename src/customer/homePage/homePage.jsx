import React from 'react'
import Slider from '../../components/imageSlider/imageSlider'
import image1 from '../../assets/images/image1.png'
import image2 from '../../assets/images/image2.png'
import image3 from '../../assets/images/image3.png'
import Header from '../../components/Header/header'

const homePage = () => {
    const images = [
        image1,  
        image2,
        image3,
      ];
  return (
    <div>
    <Header/>
    <Slider images={images} />
  </div>
  )
}

export default homePage