import {Route, BrowserRouter, Routes} from 'react-router-dom';
import InicialPage from './Components/InicialPage.js';
import UserInfos from './Components/UserInfos.js';
import MainPage from './Components/MainPage.js';

function MyRoutes(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element = {<InicialPage/>}/>
                <Route path='/form' element = {<UserInfos/>}/>
                <Route path='/mainPage' element = {<MainPage/>}/>
            </Routes>
        </BrowserRouter>
    );

}

export default MyRoutes;