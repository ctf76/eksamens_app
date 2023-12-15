import './App.css';
import MainPage from './components/mainPage.js';
import UserCreation from './components/userCreation.js';
import CreateReadRecords from './components/readRecords.js';
import UpdateRecord from './components/updateRecord.js';
import DeleteRecord from './components/deleteRecord.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <MainPage>
        <Routes>
          <Route exact="true" path="/" element={<UserCreation />} />
          <Route path="/records" element={<CreateReadRecords />} />
          <Route path="/update" element={<UpdateRecord />} />
          <Route path="/delete" element={<DeleteRecord />} />
        </Routes>
      </MainPage>
    </Router>
  );
}
