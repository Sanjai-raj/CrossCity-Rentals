
import React from 'react';
import type { City, Branch, User } from './types';

// Keeping Cities and Branches static for configuration simplicity
export const CITIES: City[] = [
  { id: 'blr', name: 'Bengaluru' },
  { id: 'mum', name: 'Mumbai' },
  { id: 'del', name: 'Delhi NCR' },
  { id: 'hyd', name: 'Hyderabad' },
  { id: 'che', name: 'Chennai' },
  { id: 'pun', name: 'Pune' },
  { id: 'kol', name: 'Kolkata' },
  { id: 'ahm', name: 'Ahmedabad' },
  { id: 'jai', name: 'Jaipur' },
  { id: 'coc', name: 'Kochi' },
  { id: 'goa', name: 'Goa' },
];

export const BRANCHES: Branch[] = [
  // Bengaluru
  { id: 'blr-apt', cityId: 'blr', name: 'Kempegowda Int. Airport', address: 'Kial Rd, Devanahalli' },
  { id: 'blr-kor', cityId: 'blr', name: 'Koramangala', address: '80ft Road, 4th Block' },
  { id: 'blr-ind', cityId: 'blr', name: 'Indiranagar', address: '100ft Road, Near Metro' },
  { id: 'blr-jpn', cityId: 'blr', name: 'JP Nagar', address: '24th Main Road' },
  
  // Mumbai
  { id: 'mum-apt', cityId: 'mum', name: 'Chhatrapati Shivaji Int. Airport', address: 'Terminal 2 Arrivals' },
  { id: 'mum-ban', cityId: 'mum', name: 'Bandra West', address: 'Hill Road, Bandra' },
  { id: 'mum-and', cityId: 'mum', name: 'Andheri East', address: 'Near Metro Station' },
  
  // Delhi
  { id: 'del-cp', cityId: 'del', name: 'Connaught Place', address: 'Inner Circle, Block B' },
  { id: 'del-air', cityId: 'del', name: 'IGI Airport T3', address: 'New Delhi' },
  { id: 'del-gur', cityId: 'del', name: 'Gurgaon Cyber City', address: 'DLF Phase 2' },
  { id: 'del-noi', cityId: 'del', name: 'Noida Sector 18', address: 'Near GIP Mall' },

  // Hyderabad
  { id: 'hyd-hit', cityId: 'hyd', name: 'Hitech City', address: 'Mindspace IT Park' },
  { id: 'hyd-apt', cityId: 'hyd', name: 'Rajiv Gandhi Int. Airport', address: 'Shamshabad' },
  { id: 'hyd-jub', cityId: 'hyd', name: 'Jubilee Hills', address: 'Road No. 36' },

  // Chennai
  { id: 'che-apt', cityId: 'che', name: 'Chennai Int. Airport', address: 'Meenambakkam' },
  { id: 'che-tn', cityId: 'che', name: 'T Nagar', address: 'North Usman Road' },
  { id: 'che-omr', cityId: 'che', name: 'OMR', address: 'Thoraipakkam' },

  // Pune
  { id: 'pun-apt', cityId: 'pun', name: 'Pune Airport', address: 'Lohegaon' },
  { id: 'pun-kp', cityId: 'pun', name: 'Koregaon Park', address: 'North Main Road' },
  { id: 'pun-hin', cityId: 'pun', name: 'Hinjewadi', address: 'Phase 1' },

  // Kolkata
  { id: 'kol-apt', cityId: 'kol', name: 'NSC Bose Int. Airport', address: 'Dum Dum' },
  { id: 'kol-ps', cityId: 'kol', name: 'Park Street', address: 'Camac Street' },
  { id: 'kol-sl', cityId: 'kol', name: 'Salt Lake', address: 'Sector V' },

  // Ahmedabad
  { id: 'ahm-apt', cityId: 'ahm', name: 'Sardar Vallabhbhai Patel Airport', address: 'Hansol' },
  { id: 'ahm-sg', cityId: 'ahm', name: 'SG Highway', address: 'Near Iskcon' },

  // Jaipur
  { id: 'jai-apt', cityId: 'jai', name: 'Jaipur Int. Airport', address: 'Sanganer' },
  { id: 'jai-c', cityId: 'jai', name: 'C Scheme', address: 'Ashok Nagar' },
  
  // Kochi
  { id: 'coc-apt', cityId: 'coc', name: 'Cochin Int. Airport', address: 'Nedumbassery' },
  { id: 'coc-ed', cityId: 'coc', name: 'Edappally', address: 'Near Lulu Mall' },

  // Goa
  { id: 'goa-dabolim', cityId: 'goa', name: 'Dabolim Airport', address: 'Vasco da Gama' },
  { id: 'goa-pan', cityId: 'goa', name: 'Panjim', address: 'Patto Plaza' },
  { id: 'goa-cal', cityId: 'goa', name: 'Calangute', address: 'Near Beach' },
];

// Helper to get random branch for distribution
export const getRandomBranch = (cityId: string) => {
  const cityBranches = BRANCHES.filter(b => b.cityId === cityId);
  return cityBranches[Math.floor(Math.random() * cityBranches.length)]?.id || cityBranches[0]?.id;
};

export const AuthContext = React.createContext<{
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});
