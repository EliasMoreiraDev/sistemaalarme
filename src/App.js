import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import NewTime from './components/pages/NewTime';
import Time from './components/pages/Time';
import Login from './components/pages/Login';
import Container from './components/layouts/Container';
import NavBar from './components/layouts/NavBar';
import SuapLogin from './login_suap/login'
import Alarm from './components/pages/Alarm';
import Cookies from 'js-cookie';

const isAuthenticated = () => {
  
  const tokenFromLocalStorage = localStorage.getItem('suapToken');
  const tokenFromCookies = Cookies.get('suapToken');
  if (tokenFromLocalStorage || tokenFromCookies) {
    return true;
  }
  return false;
};


function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Container customClass='min-heigth'>
          <Routes>
            <Route exact path='/login' element={<SuapLogin/>}/>
            <Route exact path='/newTime' element={<NewTime />} />
            <Route exact path='/times' element={<Time />} />
            <Route exact path='/time/:id' element={<Alarm />} />
          </Routes>
        </Container>
      </Router>
    </>
  );
}

export default App;

