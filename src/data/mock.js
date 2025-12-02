import { faker } from '@faker-js/faker';

export const CATEGORIES = [
  { 
    id: 'ac', 
    name: 'AC Repair', 
    icon: 'Wind', 
    color: 'bg-blue-100 text-blue-600',
    subServices: [
      { id: 'ac-install', name: 'AC Installation', price: 1500 },
      { id: 'ac-repair', name: 'AC Repair', price: 500 },
      { id: 'ac-gas', name: 'Gas Refill', price: 2500 },
      { id: 'ac-service', name: 'General Service', price: 400 }
    ]
  },
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    icon: 'Droplets', 
    color: 'bg-cyan-100 text-cyan-600',
    subServices: [
      { id: 'leak', name: 'Leakage Repair', price: 300 },
      { id: 'install', name: 'Tap Installation', price: 200 },
      { id: 'block', name: 'Blockage Removal', price: 800 }
    ]
  },
  { id: 'electrician', name: 'Electrician', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600', subServices: [] },
  { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles', color: 'bg-purple-100 text-purple-600', subServices: [] },
  { id: 'painting', name: 'Painting', icon: 'PaintBucket', color: 'bg-pink-100 text-pink-600', subServices: [] },
  { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', color: 'bg-orange-100 text-orange-600', subServices: [] },
];

export const WORKERS = Array.from({ length: 10 }).map((_, i) => ({
  id: `w-${i}`,
  name: faker.person.fullName(),
  image: faker.image.avatar(),
  profession: faker.helpers.arrayElement(['Electrician', 'Plumber', 'AC Technician']),
  rating: faker.number.float({ min: 3.5, max: 5, multipleOf: 0.1 }),
  reviews: faker.number.int({ min: 10, max: 500 }),
  verified: faker.datatype.boolean(),
  price: faker.number.int({ min: 200, max: 1000 }),
  distance: faker.number.float({ min: 0.5, max: 10, multipleOf: 0.1 }),
  skills: ['Installation', 'Repair', 'Maintenance'],
  portfolio: [
    "https://images.unsplash.com/photo-1581092921461-eab62e97a783?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400"
  ],
  about: faker.lorem.paragraph()
}));

export const BOOKINGS = Array.from({ length: 5 }).map((_, i) => ({
  id: `bk-${i}`,
  service: faker.helpers.arrayElement(['AC Repair', 'Tap Leakage', 'Fan Installation']),
  date: faker.date.recent().toLocaleDateString(),
  time: '10:00 AM',
  status: faker.helpers.arrayElement(['Pending', 'In Progress', 'Completed', 'Cancelled']),
  price: faker.number.int({ min: 300, max: 1500 }),
  workerName: faker.person.fullName(),
  workerImage: faker.image.avatar(),
  trackingStep: faker.number.int({ min: 0, max: 4 }) // 0: Accepted, 1: En Route, 2: Arrived, 3: In Progress, 4: Completed
}));

export const ADDRESSES = [
  { id: 1, type: 'Home', text: 'Flat 402, Galaxy Apartments, Sector 45, Gurgaon' },
  { id: 2, type: 'Office', text: 'WeWork, Cyber City, DLF Phase 2, Gurgaon' }
];
