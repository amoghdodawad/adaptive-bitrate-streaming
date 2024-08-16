import logo from './logo.svg';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/appStore';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Toaster/>
            <Routes>
              
            </Routes>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
