import React from 'react';
import { useParams } from 'react-router-dom';
import CapsuleDisplay from '../components/CapsuleDisplay';

export default function Capsule() {
  const { date, mode } = useParams();

  return (
    <div className="capsule-page">
      <CapsuleDisplay date={date} mode={mode} />
    </div>
  );
}