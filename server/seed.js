const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Car = require('./models/Car');
const User = require('./models/User');
require('dotenv').config();



const cars = [
  // ================= HATCHBACKS (Economy & Premium) =================
  // Bengaluru
  { 
    branchId: 'blr-kor', make: 'Maruti', model: 'Swift', year: 2023, type: 'Hatchback', transmission: 'Manual', fuel: 'Petrol', seats: 5, 
    pricePerHour: 95, pricePerDay: 1800, rating: 4.8, trips: 42, features: ['Bluetooth', 'Airbags'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/54399/swift-exterior-right-front-three-quarter-64.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'blr-ind', make: 'Tata', model: 'Tiago', year: 2022, type: 'Hatchback', transmission: 'Manual', fuel: 'Petrol', seats: 5, 
    pricePerHour: 80, pricePerDay: 1500, rating: 4.6, trips: 65, features: ['Harman Audio', 'Safety Rated'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39345/tiago-exterior-right-front-three-quarter-26.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'blr-apt', make: 'Hyundai', model: 'i20', year: 2023, type: 'Hatchback', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 110, pricePerDay: 2100, rating: 4.7, trips: 34, features: ['Sunroof', 'Digital Cluster'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/150603/i20-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80' 
  },
  // Mumbai
  { 
    branchId: 'mum-and', make: 'Maruti', model: 'Baleno', year: 2023, type: 'Hatchback', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 105, pricePerDay: 2000, rating: 4.5, trips: 58, features: ['360 Camera', 'HUD'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-66.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'mum-ban', make: 'Maruti', model: 'Wagon R', year: 2022, type: 'Hatchback', transmission: 'Manual', fuel: 'CNG', seats: 5, 
    pricePerHour: 75, pricePerDay: 1400, rating: 4.3, trips: 120, features: ['High Efficiency', 'Spacious'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112947/wagon-r-2022-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  // Delhi
  { 
    branchId: 'del-cp', make: 'Tata', model: 'Altroz', year: 2023, type: 'Hatchback', transmission: 'Manual', fuel: 'Diesel', seats: 5, 
    pricePerHour: 100, pricePerDay: 1900, rating: 4.8, trips: 22, features: ['5-Star Safety', 'Cruise Control'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/32597/altroz-exterior-right-front-three-quarter-79.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'del-gur', make: 'Renault', model: 'Kwid', year: 2022, type: 'Hatchback', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 70, pricePerDay: 1300, rating: 4.2, trips: 89, features: ['Compact', 'Touchscreen'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141099/kwid-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  // Hyderabad
  { 
    branchId: 'hyd-hit', make: 'Toyota', model: 'Glanza', year: 2023, type: 'Hatchback', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 105, pricePerDay: 2000, rating: 4.6, trips: 30, features: ['360 Camera', 'Connected Car'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/112839/glanza-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80' 
  },

  // ================= SEDANS (Compact, Mid-size) =================
  // Bengaluru
  { 
    branchId: 'blr-jpn', make: 'Honda', model: 'City', year: 2023, type: 'Sedan', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 140, pricePerDay: 2800, rating: 4.9, trips: 45, features: ['Sunroof', 'Rear AC', 'ADAS'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'blr-apt', make: 'Maruti', model: 'Dzire', year: 2022, type: 'Sedan', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 100, pricePerDay: 2000, rating: 4.7, trips: 150, features: ['High Mileage', 'Comfort'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/45691/dzire-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' 
  },
  // Mumbai
  { 
    branchId: 'mum-apt', make: 'Skoda', model: 'Slavia', year: 2023, type: 'Sedan', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 160, pricePerDay: 3200, rating: 4.8, trips: 28, features: ['Ventilated Seats', 'Sunroof'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/96337/slavia-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'mum-ban', make: 'Hyundai', model: 'Verna', year: 2024, type: 'Sedan', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 170, pricePerDay: 3400, rating: 4.9, trips: 15, features: ['ADAS Level 2', 'Heated Seats'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121943/verna-exterior-right-front-three-quarter-101.jpeg?isig=0&q=80' 
  },
  // Delhi
  { 
    branchId: 'del-noi', make: 'Honda', model: 'Amaze', year: 2022, type: 'Sedan', transmission: 'Automatic', fuel: 'Diesel', seats: 5, 
    pricePerHour: 110, pricePerDay: 2200, rating: 4.6, trips: 67, features: ['Paddle Shifters', 'Large Boot'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/102425/amaze-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'del-gur', make: 'Volkswagen', model: 'Virtus', year: 2023, type: 'Sedan', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 165, pricePerDay: 3300, rating: 5.0, trips: 20, features: ['GT Performance', 'Digital Cockpit'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144681/virtus-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  // Pune
  { 
    branchId: 'pun-kp', make: 'Maruti', model: 'Ciaz', year: 2022, type: 'Sedan', transmission: 'Manual', fuel: 'Hybrid', seats: 5, 
    pricePerHour: 120, pricePerDay: 2400, rating: 4.5, trips: 45, features: ['Rear Legroom', 'Smart Hybrid'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/48542/ciaz-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },

  // ================= SUVs (Compact, Mid-size, Large) =================
  // Bengaluru
  { 
    branchId: 'blr-kor', make: 'Tata', model: 'Nexon', year: 2023, type: 'SUV', transmission: 'Manual', fuel: 'Petrol', seats: 5, 
    pricePerHour: 130, pricePerDay: 2600, rating: 4.9, trips: 78, features: ['Sunroof', 'Ventilated Seats'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'blr-ind', make: 'Mahindra', model: 'Thar', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 4, 
    pricePerHour: 210, pricePerDay: 4200, rating: 4.9, trips: 92, features: ['4x4', 'Convertible Top'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'blr-apt', make: 'Toyota', model: 'Innova Crysta', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 7, 
    pricePerHour: 250, pricePerDay: 5000, rating: 4.9, trips: 120, features: ['Captain Seats', 'Highway Cruiser'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-3.png?isig=0&q=80' 
  },
  // Mumbai
  { 
    branchId: 'mum-apt', make: 'Mahindra', model: 'XUV700', year: 2024, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 7, 
    pricePerHour: 280, pricePerDay: 5600, rating: 4.9, trips: 40, features: ['ADAS', 'Panoramic Sunroof', 'Dual Screens'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'mum-and', make: 'Maruti', model: 'Brezza', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 125, pricePerDay: 2500, rating: 4.7, trips: 55, features: ['Sunroof', 'Heads Up Display'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121219/brezza-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  // Delhi
  { 
    branchId: 'del-air', make: 'Toyota', model: 'Fortuner', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 7, 
    pricePerHour: 400, pricePerDay: 8000, rating: 5.0, trips: 35, features: ['4x4 Sigma', 'Power', 'Leather'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'del-gur', make: 'Kia', model: 'Seltos', year: 2024, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, 
    pricePerHour: 165, pricePerDay: 3300, rating: 4.8, trips: 44, features: ['Bose Audio', 'ADAS'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/174323/seltos-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'del-noi', make: 'Hyundai', model: 'Creta', year: 2024, type: 'SUV', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 170, pricePerDay: 3400, rating: 4.8, trips: 38, features: ['Panoramic Sunroof', 'Ventilated Seats'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  // Hyderabad
  { 
    branchId: 'hyd-hit', make: 'Tata', model: 'Harrier', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, 
    pricePerHour: 220, pricePerDay: 4400, rating: 4.8, trips: 25, features: ['Dark Edition', 'ADAS'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142739/harrier-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  // Chennai
  { 
    branchId: 'che-tn', make: 'Tata', model: 'Punch', year: 2023, type: 'SUV', transmission: 'Manual', fuel: 'Petrol', seats: 5, 
    pricePerHour: 95, pricePerDay: 1900, rating: 4.6, trips: 60, features: ['Compact', 'Safety'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39015/punch-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'che-omr', make: 'Renault', model: 'Kiger', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 100, pricePerDay: 2000, rating: 4.5, trips: 40, features: ['Turbo', 'Sport Mode'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141095/kiger-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  // Goa (Tourist Specials)
  { 
    branchId: 'goa-pan', make: 'Mahindra', model: 'Scorpio N', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 7, 
    pricePerHour: 240, pricePerDay: 4800, rating: 4.9, trips: 88, features: ['4xplor', 'Sony Audio'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40432/scorpio-n-exterior-right-front-three-quarter-75.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'goa-cal', make: 'Maruti', model: 'Jimny', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Petrol', seats: 4, 
    pricePerHour: 180, pricePerDay: 3600, rating: 4.7, trips: 30, features: ['4x4', 'Convertible Feel'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140549/jimny-exterior-right-front-three-quarter-17.jpeg?isig=0&q=80' 
  },

  // ================= LUXURY (Premium High-End) =================
  // Mumbai
  { 
    branchId: 'mum-apt', make: 'Mercedes-Benz', model: 'C-Class', year: 2023, type: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, 
    pricePerHour: 800, pricePerDay: 16000, rating: 5.0, trips: 12, features: ['MBUX', 'Massage Seats', 'Ambient Light'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/116221/c-class-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'mum-ban', make: 'BMW', model: '3 Series', year: 2023, type: 'Luxury', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 850, pricePerDay: 17000, rating: 5.0, trips: 15, features: ['M Sport', 'Gesture Control'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140591/3-series-gran-limousine-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  // Delhi
  { 
    branchId: 'del-air', make: 'Audi', model: 'A4', year: 2023, type: 'Luxury', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 750, pricePerDay: 15000, rating: 4.9, trips: 18, features: ['Virtual Cockpit', 'Quattro'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/51909/a4-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'del-gur', make: 'Mercedes-Benz', model: 'GLA', year: 2023, type: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, 
    pricePerHour: 700, pricePerDay: 14000, rating: 4.8, trips: 22, features: ['Compact Luxury', 'Panoramic Roof'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140495/gla-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  // Bengaluru
  { 
    branchId: 'blr-apt', make: 'BMW', model: 'X1', year: 2024, type: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, 
    pricePerHour: 780, pricePerDay: 15600, rating: 4.9, trips: 25, features: ['Curved Display', 'Adaptive Suspension'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140591/x1-exterior-right-front-three-quarter-8.png?isig=0&q=80' 
  },
  // Hyderabad
  { 
    branchId: 'hyd-jub', make: 'Toyota', model: 'Camry', year: 2023, type: 'Luxury', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, 
    pricePerHour: 550, pricePerDay: 11000, rating: 4.9, trips: 30, features: ['Executive Rear Seats', 'Hybrid Quiet'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/110229/camry-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  // Chennai
  { 
    branchId: 'che-apt', make: 'Volvo', model: 'XC40', year: 2023, type: 'Luxury', transmission: 'Automatic', fuel: 'Electric', seats: 5, 
    pricePerHour: 700, pricePerDay: 14000, rating: 4.9, trips: 10, features: ['Pure Electric', 'Safety Tech'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/131129/xc40-recharge-exterior-right-front-three-quarter-10.jpeg?isig=0&q=80' 
  },
  // Ahmedabad
  { 
    branchId: 'ahm-sg', make: 'Kia', model: 'Carnival', year: 2023, type: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 7, 
    pricePerHour: 600, pricePerDay: 12000, rating: 4.9, trips: 20, features: ['Limousine Comfort', 'VIP Seats'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/173505/carnival-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },

  // ================= FILLERS FOR OTHER CITIES (Mixed Types) =================
  // Kolkata
  { 
    branchId: 'kol-sl', make: 'Maruti', model: 'Ertiga', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'CNG', seats: 7, 
    pricePerHour: 130, pricePerDay: 2600, rating: 4.6, trips: 95, features: ['Value for Money', '7 Seater'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/ertiga-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'kol-ps', make: 'Hyundai', model: 'Aura', year: 2022, type: 'Sedan', transmission: 'Manual', fuel: 'CNG', seats: 5, 
    pricePerHour: 85, pricePerDay: 1700, rating: 4.4, trips: 55, features: ['Compact Sedan', 'Economy'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139651/aura-exterior-right-front-three-quarter-8.jpeg?isig=0&q=80' 
  },
  // Jaipur
  { 
    branchId: 'jai-apt', make: 'Maruti', model: 'Grand Vitara', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, 
    pricePerHour: 160, pricePerDay: 3200, rating: 4.8, trips: 45, features: ['Strong Hybrid', 'Panoramic Roof'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/grand-vitara-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'jai-c', make: 'Mahindra', model: 'Bolero Neo', year: 2023, type: 'SUV', transmission: 'Manual', fuel: 'Diesel', seats: 7, 
    pricePerHour: 120, pricePerDay: 2400, rating: 4.5, trips: 78, features: ['Rugged', 'Tough'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/100833/bolero-neo-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  // Kochi
  { 
    branchId: 'coc-ed', make: 'Maruti', model: 'Ignis', year: 2022, type: 'Hatchback', transmission: 'Manual', fuel: 'Petrol', seats: 5, 
    pricePerHour: 80, pricePerDay: 1600, rating: 4.4, trips: 30, features: ['Funky Design', 'Compact'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/140589/ignis-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'coc-apt', make: 'Toyota', model: 'Hyryder', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, 
    pricePerHour: 165, pricePerDay: 3300, rating: 4.8, trips: 22, features: ['AWD Option', 'Hybrid'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/124103/urban-cruiser-hyryder-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  
  // Add more variety to make it ~40-50 cars
  { 
    branchId: 'del-cp', make: 'Tata', model: 'Safari', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 7, 
    pricePerHour: 260, pricePerDay: 5200, rating: 4.8, trips: 18, features: ['Boss Mode', 'Ventilated Seats'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/142865/safari-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'mum-ban', make: 'MG', model: 'Hector', year: 2023, type: 'SUV', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 190, pricePerDay: 3800, rating: 4.7, trips: 33, features: ['Huge Screen', 'Internet Inside'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/hector-exterior-right-front-three-quarter-8.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'blr-kor', make: 'Jeep', model: 'Compass', year: 2022, type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, 
    pricePerHour: 240, pricePerDay: 4800, rating: 4.7, trips: 42, features: ['4x4', 'Premium Interior'],
    image: 'https://images.hgmsites.net/lrg/2022-jeep-compass-limited-4x4-angular-front-exterior-view_100825837_l.jpg' 
  },
  { 
    branchId: 'hyd-apt', make: 'Maruti', model: 'Alto K10', year: 2023, type: 'Hatchback', transmission: 'Manual', fuel: 'Petrol', seats: 4, 
    pricePerHour: 65, pricePerDay: 1200, rating: 4.2, trips: 150, features: ['Economy', 'Easy Parking'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/126599/alto-k10-exterior-right-front-three-quarter.jpeg?isig=0&q=80' 
  },
  { 
    branchId: 'che-omr', make: 'Hyundai', model: 'Grand i10 Nios', year: 2023, type: 'Hatchback', transmission: 'Automatic', fuel: 'Petrol', seats: 5, 
    pricePerHour: 85, pricePerDay: 1700, rating: 4.5, trips: 67, features: ['City Drive', 'Compact'],
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139591/grand-i10-nios-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80' 
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multicity_carshare')
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing data
    await Car.deleteMany({});
    await User.deleteMany({});
    
    // Seed Cars
    await Car.insertMany(cars);
    console.log('Cars Seeded');

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create([
      { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: 'customer' }
    ]);
    console.log('Users Seeded');

    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });