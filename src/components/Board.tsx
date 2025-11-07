import React, { useState } from 'react';
import Column from './Column';
// import { Column as ColumnType, Card as CardType } from '../types';
import '../styles/Board.scss';

const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: 'todo', title: 'To Do', position: 0 },
    { id: 'inprogress', title: 'In Progress', position: 1 },
    { id: 'done', title: 'Done', position: 2 }
  ]);

  const [cards, setCards] = useState<CardType[]>([
    { 
      id: '1', 
      title: 'Welcome to Kanban Board', 
      description: 'Drag and drop cards between columns', 
      columnId: 'todo', 
      position: 0 
    },
    { 
      id: '2', 
      title: 'Create New Tasks', 
      description: 'Use the input below each column', 
      columnId: 'todo', 
      position: 1 
    }
  ]);

  const handleAddCard = (columnId: string, title: string) => {
    const newCard: CardType = {
      id: Date.now().toString(),
      title,
      description: 'Add description here...',
      columnId,
      position: cards.filter(card => card.columnId === columnId).length
    };
    setCards([...cards, newCard]);
  };

  const handleMoveCard = (cardId: string, newColumnId: string) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, columnId: newColumnId }
        : card
    ));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    handleMoveCard(cardId, columnId);
  };

  return (
    <div className="board">
      <div className="board-header">
        <h1>My Kanban Board</h1>
        <p>Drag and drop cards to organize your tasks</p>
      </div>
      
      <div className="columns-container">
        {columns.map(column => (
          <div
            key={column.id}
            className="column-wrapper"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Column
              column={column}
              cards={cards.filter(card => card.columnId === column.id)}
              onAddCard={handleAddCard}
              onMoveCard={handleMoveCard}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;