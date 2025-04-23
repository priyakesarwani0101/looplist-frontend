import React from 'react';
import { LoopForm } from '../components/loops/LoopForm';

export const CreateLoopPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* <h1 className="text-2xl font-bold mb-6">Create a New Loop</h1> */}
      <LoopForm />
    </div>
  );
};