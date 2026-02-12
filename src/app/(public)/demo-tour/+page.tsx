import React from 'react';
import { useNavigate } from '@koda/runtime';
import { DemoTour } from './_components/DemoTour';

export default function DemoTourRoute() {
   const navigate = useNavigate();

   const handleStartDemo = () => {
      // Navigate to login with demo flag
      navigate('/auth?mode=login&demo=true');
   };

   const handleBack = () => {
      navigate('/');
   };

   return (
      <DemoTour
         onStartDemo={handleStartDemo}
         onBack={handleBack}
      />
   );
}