import { Routes  , Route ,BrowserRouter} from 'react-router-dom'
import HomePage from './pages/homepage/HomePage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import './App.css'

import NotificationPage from './pages/notificaitons/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
function App() {

  return (
   <div>
<div className='flex max-w-6xl mx-auto'>
  <BrowserRouter>
  <Sidebar/>

			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<NotificationPage />}/>
        <Route path='/profile/:username' element={<ProfilePage />}/>
			</Routes>
      <RightPanel/>
  </BrowserRouter>
		</div>
   </div>
  )
}

export default App
