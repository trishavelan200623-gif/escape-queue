import type { Location, Notification, Prediction, HourlyData } from '../types';

export const mockLocations: Location[] = [
  {
    id: 'loc_001',
    name: 'City General Hospital',
    type: 'hospital',
    address: '14 Medical Drive',
    city: 'Metro City',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop',
    currentCount: 142,
    capacity: 200,
    crowdLevel: 'high',
    waitingTime: 45,
    operatingHours: '24/7',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 'loc_002',
    name: 'National Bank Branch',
    type: 'bank',
    address: '88 Finance Street',
    city: 'Metro City',
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&h=400&fit=crop',
    currentCount: 34,
    capacity: 80,
    crowdLevel: 'medium',
    waitingTime: 18,
    operatingHours: '9AM – 5PM',
    lat: 40.7148,
    lng: -74.013,
  },
  {
    id: 'loc_003',
    name: 'Central Shopping Mall',
    type: 'mall',
    address: '200 Commerce Blvd',
    city: 'Metro City',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop',
    currentCount: 89,
    capacity: 500,
    crowdLevel: 'low',
    waitingTime: 5,
    operatingHours: '10AM – 10PM',
    lat: 40.7108,
    lng: -74.009,
  },
  {
    id: 'loc_004',
    name: 'Metro Transit Hub',
    type: 'transport',
    address: '1 Station Square',
    city: 'Metro City',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop',
    currentCount: 310,
    capacity: 400,
    crowdLevel: 'high',
    waitingTime: 30,
    operatingHours: '5AM – 12AM',
    lat: 40.7138,
    lng: -74.002,
  },
  {
    id: 'loc_005',
    name: 'City Hall Services',
    type: 'government',
    address: '5 Civic Center Plaza',
    city: 'Metro City',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
    currentCount: 28,
    capacity: 100,
    crowdLevel: 'low',
    waitingTime: 10,
    operatingHours: '8AM – 4PM',
    lat: 40.7158,
    lng: -74.016,
  },
  {
    id: 'loc_006',
    name: 'The Grand Restaurant',
    type: 'restaurant',
    address: '42 Culinary Lane',
    city: 'Metro City',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    currentCount: 55,
    capacity: 80,
    crowdLevel: 'medium',
    waitingTime: 22,
    operatingHours: '11AM – 11PM',
    lat: 40.7118,
    lng: -74.011,
  },
];

export const generateNotifications = (): Notification[] => [
  {
    id: 'notif_001',
    type: 'alert',
    title: 'High Crowd Alert',
    message: 'City General Hospital is at 71% capacity. Expect 45+ min wait.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    locationId: 'loc_001',
  },
  {
    id: 'notif_002',
    type: 'warning',
    title: 'Crowd Increasing',
    message: 'Metro Transit Hub crowd rising. Consider alternate routes.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    locationId: 'loc_004',
  },
  {
    id: 'notif_003',
    type: 'info',
    title: 'Best Time to Visit',
    message: 'National Bank is least crowded between 2PM – 3PM today.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    locationId: 'loc_002',
  },
  {
    id: 'notif_004',
    type: 'success',
    title: 'Crowd Cleared',
    message: 'Central Shopping Mall crowd dropped to low. Great time to visit!',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true,
    locationId: 'loc_003',
  },
];

export const generatePredictions = (locationId: string): Prediction[] => {
  const basePatterns: Record<string, number[]> = {
    loc_001: [30, 25, 20, 18, 22, 45, 80, 120, 150, 160, 155, 140, 130, 125, 140, 155, 160, 150, 130, 110, 90, 70, 55, 40],
    loc_002: [0, 0, 0, 0, 0, 0, 0, 0, 20, 45, 60, 70, 65, 55, 60, 70, 65, 50, 30, 0, 0, 0, 0, 0],
    loc_003: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 120, 200, 250, 280, 300, 320, 310, 280, 240, 180, 120, 80, 0],
    loc_004: [80, 60, 40, 30, 50, 120, 280, 350, 320, 200, 150, 180, 200, 180, 160, 180, 200, 280, 350, 320, 250, 180, 130, 100],
    loc_005: [0, 0, 0, 0, 0, 0, 0, 0, 30, 60, 80, 90, 85, 70, 75, 80, 70, 50, 20, 0, 0, 0, 0, 0],
    loc_006: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 60, 70, 55, 45, 50, 60, 70, 75, 70, 60, 40, 10],
  };

  const pattern = basePatterns[locationId] || basePatterns['loc_001'];
  const location = mockLocations.find(l => l.id === locationId);
  const capacity = location?.capacity || 200;

  return pattern.map((count, hour) => {
    const noise = Math.floor(Math.random() * 10) - 5;
    const predicted = Math.max(0, count + noise);
    const ratio = predicted / capacity;
    return {
      hour,
      label: hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`,
      predictedCount: predicted,
      crowdLevel: ratio < 0.4 ? 'low' : ratio < 0.7 ? 'medium' : 'high',
      waitingTime: Math.floor(predicted / capacity * 60),
      confidence: 75 + Math.floor(Math.random() * 20),
    };
  });
};

export const generateHourlyData = (locationId: string): HourlyData[] => {
  const predictions = generatePredictions(locationId);
  return predictions.slice(6, 22).map(p => ({
    hour: p.label,
    count: Math.max(0, p.predictedCount + Math.floor(Math.random() * 15) - 7),
    predicted: p.predictedCount,
  }));
};