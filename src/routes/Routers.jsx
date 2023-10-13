import { Route, Routes, useSearchParams} from 'react-router-dom';
import Landing from '../pages/Landing';
import InviteContext from '../context/InviteContext';
import { useState } from 'react';
const Routers = () => {

  const [searchParams, setSearchParams] = useSearchParams();
	const inv = searchParams.get('invite');

  const [invId, setInvId] = useState(searchParams.get('invite'));


  return (
    <InviteContext.Provider value={{invId, setInvId}}>    
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/user' element={<Landing />} />
      </Routes>
    </InviteContext.Provider>
  );
};
export default Routers;
