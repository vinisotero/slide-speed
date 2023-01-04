import '../App.css'
import { useNavigate } from 'react-router-dom';

function UserInfos() {

  const width = window.screen.availWidth;
  const height = window.screen.availHeight;

  const navigate = useNavigate();
  const back = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <>
    {width >= 700 && height >= 500 ? (

      <>
      <h1>Before We Start</h1>
      <div className = "UserInfos">
        <div className = "formArea">
          <form>
            <label htmlFor="username">Name</label>
            <br></br>
            <input id = "username" type = "text"></input>
            <br></br>
            <label htmlFor="lastname">Last Name</label>
            <br></br>
            <input id = "lastname" type = "text"></input>
            <br></br>
            <label htmlFor="country">Country</label>
            <br></br>
            <input id = "country" type = "text"></input>
            <br></br>
            <label htmlFor="email">Email</label>
            <br></br>
            <input id = "email" type = "email"></input>
            <br></br>
            <button className = "classicButton" onClick = {back}>Back</button>
            <button id = "start-button" className = "classicButton" >Start</button>
          </form>
        </div>
      </div>
      </>

    ): (
      <><p id = 'error-mesage'>Your device is too small! Use a tablet to use it!</p></>
    )}
    </>
  );
}

export default UserInfos;
