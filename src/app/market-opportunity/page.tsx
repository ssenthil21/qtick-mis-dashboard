'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { sampleClients } from '@/lib/seed';

declare const L: any;

interface DensityPoint {
  lat: number;
  lng: number;
  density: number;
}

export default function MarketOpportunityPage() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      const map = L.map('client-map').setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      sampleClients.forEach((client) => {
        if (client.location) {
          L.marker([client.location.lat, client.location.lng])
            .addTo(map)
            .bindPopup(client.name);
        }
      });

      const loadDensity = async () => {
        try {
          const res = await fetch('https://example.com/api/business-density');
          const data: DensityPoint[] = await res.json();
          data.forEach((point) => {
            L.circle([point.lat, point.lng], {
              radius: point.density * 1000,
              color: 'orange',
            }).addTo(map);
          });
        } catch (error) {
          console.error('Failed to load density data', error);
          const fallback: DensityPoint[] = [
            { lat: 40.7128, lng: -74.006, density: 80 },
            { lat: 34.0522, lng: -118.2437, density: 60 },
          ];
          fallback.forEach((point) => {
            L.circle([point.lat, point.lng], {
              radius: point.density * 1000,
              color: 'orange',
            }).addTo(map);
          });
        }
      };

      loadDensity();
    };

    document.body.appendChild(script);
  }, []);

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Market Opportunity Mapper
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Explore client locations and potential markets to plan expansion.
            </p>
          </div>
          <div
            id="client-map"
            className="w-full h-[600px] rounded-md border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
