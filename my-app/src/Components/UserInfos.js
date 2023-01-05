import '../App.css'
import { useNavigate } from 'react-router-dom';
import icon from '../imgs/icon-erro.png';

let user = {username: '', lastname: '', country: '', email: ''}

function UserInfos() {

  const width = window.screen.availWidth;
  const height = window.screen.availHeight;
  const navigate = useNavigate();
  const back = (e) => {
    e.preventDefault();
    navigate('/');
  }

  const start = (e) => {
    e.preventDefault();
    user.username = document.getElementById('username').value
    user.lastname = document.getElementById('lastname').value
    user.country = document.getElementById('country').value
    user.email = document.getElementById('email').value
    navigate('/mainPage');
  }

  return (
    <div id = "userInfos">
    {width >= 700 && height >= 500 ? (

      <>
      <h1>Before We Start</h1>
      <div className = "UserInfos">
        <div className = "formArea">
          <form>
            <label htmlFor="username">Name</label>
            <br></br>
            <input id = "username" type = "text" required></input>
            <br></br>
            <label htmlFor="lastname">Last Name</label>
            <br></br>
            <input id = "lastname" type = "text" required></input>
            <br></br>
            <label htmlFor="country">Country</label>
            <br></br>
            <input id = "country" type = "text" required></input>
            <br></br>
            <label htmlFor="email">Email</label>
            <br></br>
            <input id = "email" type = "email" required></input>
            <br></br>
            <button className = "classicButton" onClick = {back}>Back</button>
            <button id = "start-button" className = "classicButton" onClick={start} >Start</button>
          </form>
        </div>
      </div>
      </>

    ): (
      <>
        <p id = 'error-mesage'>Your device is too small! Use a tablet to use this website!</p>
        <img src={icon} alt="Icon Error" id = "icon-error"></img>
      </>
    )}
    </div>
  );
}

export const userInfo = user;
export default UserInfos;
