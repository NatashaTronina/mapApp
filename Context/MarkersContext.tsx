// import React, { createContext, useContext, useState } from 'react';
// import { MarkersData } from '../types';


// const MarkersContext = createContext<{
//   markers: MarkersData[];
//   setMarkers: React.Dispatch<React.SetStateAction<MarkersData[]>>;
// } | undefined>(undefined);

// export const MarkersProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
//   const [markers, setMarkers] = useState<MarkersData[]>([]);

//   return (
//     <MarkersContext.Provider value={{ markers, setMarkers }}>
//       {children}
//     </MarkersContext.Provider>
//   );
// };

// export const useMarkersContext = () => {
//   const context = useContext(MarkersContext);
//   if (context === undefined) {
//     throw new Error('useMarkers must be used with a MarkersProvider');
//   }
//   return context;
// };