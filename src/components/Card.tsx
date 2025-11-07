import React, { useState } from 'react';
// import { Card as CardType } from '../types';
import '../styles/Card.scss';

interface CardProps {
  card: CardType;
  onMoveCard: (cardId: string, newColumnId: string) => void;
}

const Card: React.FC<CardProps> = ({ card, onMoveCard }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', card.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h4>{card.title}</h4>
      {/* <p>{card.description}</p> */}
    </div>
  );
};

export default Card;  