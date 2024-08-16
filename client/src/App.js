import './App.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/appStore';
import { PersistGate } from 'redux-persist/integration/react';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Upload from './components/upload/Upload';
import Protected from './components/protected/Protected';
import Search from './components/search/Search';
import Watch from './components/watch/Watch';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Toaster/>
            <Navbar/>
            <Routes>
              <Route path='/' element={<Search/>}/>
              <Route path='/watch' element={<Watch/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/video/upload' element={
                <Protected next='/video/upload'>
                  <Upload/>
                </Protected>
              }/>
            </Routes>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
