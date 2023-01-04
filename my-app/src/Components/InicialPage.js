import '../App.css'
import {useNavigate} from 'react-router-dom'
import icon from '../imgs/icon-erro.png'

function InicialPage() {

  const width = window.screen.availWidth;
  const height = window.screen.availHeight;
  let currentItem = 0
  const navigate = useNavigate()

  const teste = (e) => {
    const items = document.querySelectorAll(".item");
    const maxItems = items.length;
    var isLeft = true
    var teste = e.target.className
    var test = teste + ''

    
    if(test == 'arrow-left control'){
      isLeft = true    
    }else{
      isLeft = false
    }

    if (isLeft) {
      currentItem -= 1;
    } else {
      currentItem += 1;
    }

    if (currentItem >= maxItems) {
      currentItem = 0;
    }

    if (currentItem < 0) {
      currentItem = maxItems - 1;
    }

    items.forEach((item) => item.classList.remove("current-item"));

    items[currentItem].scrollIntoView({
      behavior: "smooth",
      inline: "center"
    });

    items[currentItem].classList.add("current-item");

  }

  const skip = () =>{
    navigate('/form')
  }

  return (
    
    <>
    {width >= 700 && height >= 500 ? (
      <>
        <h1 className = "title">Tutorial</h1>
        <div className="container">
          <button className="arrow-left control" aria-label="Previous image" onClick={teste}>◀</button>
          <button className="arrow-right control" aria-label="Next Image" onClick={teste}>▶</button>
          <div className="gallery-wrapper">
            <div className="gallery">
              <img src="https://source.unsplash.com/random/250x250/?beach" alt="Beach Image" className="item current-item"></img>
              <img src="https://source.unsplash.com/random/250x250/?animal" alt="Animal Image" className="item current-item"></img>
              <img src="https://source.unsplash.com/random/250x250/?street" alt="Street Image" className="item current-item"></img>
              <img src="https://source.unsplash.com/random/250x250/?zoo" alt="Zoo Image" className="item current-item"></img>
              <img src="https://source.unsplash.com/random/250x250/?model" alt="Model Image" className="item current-item"></img>
            </div>
          </div>
        </div>
        <button className = "classicButton" onClick={skip}>Skip Tutorial</button>
      </>
    ):(
      <>
        <p id = 'error-mesage'>Your device is too small! Use a tablet to use this website!</p>
        <img src={icon} alt="Icon Error" id = "icon-error"></img>
      </>
    )}
    </>
    
  );
}

export default InicialPage;