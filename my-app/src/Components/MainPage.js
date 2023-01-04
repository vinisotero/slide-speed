import '../App.css'
import { useNavigate } from 'react-router-dom';
import {userInfo} from "./UserInfos"

function MainPage() {

  const width = window.screen.availWidth;
  const height = window.screen.availHeight;
  const navigate = useNavigate();



  return (
    <>
    {width >= 700 && height >= 500 ? (
      <>
        
      </>

    ): (
      <><p id = 'error-mesage'>Your device is too small! Use a tablet to use this website!</p></>
    )}
    </>
  );
}

export default MainPage;
