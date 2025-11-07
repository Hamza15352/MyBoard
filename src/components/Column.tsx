import React, { useState } from 'react';
// import { Column as ColumnType, Card as CardType } from '../types';
import Card from './Card';
import '../styles/Column.scss';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string, title: string) => void;
  onMoveCard: (cardId: string, newColumnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, cards, onAddCard, onMoveCard }) => {
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle);
      setNewCardTitle('');
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="card-count">{cards.length}</span>
      </div>
      
      <div className="cards-list">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            onMoveCard={onMoveCard}
          />
        ))}
      </div>
      
      <div className="add-card-section">
        <input
          type="text"
          placeholder="Add a card..."
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
        />
        <button onClick={handleAddCard}>Add</button>
      </div>
    </div>
  );
};

export default Column;