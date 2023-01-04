import {Route, BrowserRouter, Routes} from 'react-router-dom';
import InicialPage from './Components/InicialPage.js';
import UserInfos from './Components/UserInfos.js';

function MyRoutes(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element = {<InicialPage/>}/>
                <Route path='/form' element = {<UserInfos/>}/>
            </Routes>
        </BrowserRouter>
    );

}

export default MyRoutes;