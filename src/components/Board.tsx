

  import React, { useState, useEffect } from 'react';
  import '../styles/Board.scss';

  interface CardType {
    id: string;
    title: string;
    columnId: string;
    position: number;
    status: 'todo' | 'inprogress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
  }

  interface ColumnType {
    id: string;
    title: string;
    position: number;
  }

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
        columnId: 'todo', 
        position: 0,
        status: 'todo'
      },
      { 
        id: '2', 
        title: 'Create New Tasks', 
        columnId: 'todo', 
        position: 1,
        status: 'todo'
      },
      { 
        id: '3', 
        title: 'In Progress Task', 
        columnId: 'inprogress', 
        position: 0,
        status: 'inprogress'
      },
      { 
        id: '4', 
        title: 'Completed Task', 
        columnId: 'done', 
        position: 0,
        status: 'done'
      }
    ]);

    useEffect(() => {
      const savedCards = localStorage.getItem('kanbanCards');
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('kanbanCards', JSON.stringify(cards));
    }, [cards]);

    const handleAddCard = (columnId: string, title: string) => {
      if (!title.trim()) return;
      
      const newCard: CardType = {
        id: Date.now().toString(),
        title,
        columnId,
        position: cards.filter(card => card.columnId === columnId).length,
        status: columnId as 'todo' | 'inprogress' | 'done'
      };
      
      setCards([...cards, newCard]);
    };

    const handleMoveCard = (cardId: string, newColumnId: string) => {
      console.log(`Moving card ${cardId} to ${newColumnId}`);
      
      setCards(cards.map(card => {
        if (card.id === cardId) {
          const updatedCard = { 
            ...card, 
            columnId: newColumnId,
            status: newColumnId as 'todo' | 'inprogress' | 'done'
          };
          console.log('Updated card:', updatedCard);
          return updatedCard;
        }
        return card;
      }));
    };

    const handleDeleteCard = (cardId: string) => {
      setCards(cards.filter(card => card.id !== cardId));
    };

    const handleUpdateCard = (cardId: string, updates: Partial<CardType>) => {
      setCards(cards.map(card => 
        card.id === cardId 
          ? { ...card, ...updates }
          : card
      ));
    };

    const handleDragStart = (e: React.DragEvent, cardId: string) => {
      e.dataTransfer.setData('cardId', cardId);
      e.dataTransfer.setData('sourceColumn', (e.target as HTMLElement).closest('.column-wrapper')?.id || '');
      console.log('Drag started:', cardId);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.remove('drag-over');
    };

    const handleDrop = (e: React.DragEvent, columnId: string) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).classList.remove('drag-over');
      
      const cardId = e.dataTransfer.getData('cardId');
      const sourceColumn = e.dataTransfer.getData('sourceColumn');
      
      console.log(`Drop: Card ${cardId} from ${sourceColumn} to ${columnId}`);
      
      if (cardId) {
        handleMoveCard(cardId, columnId);
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'todo': return '#ff6b6b';
        case 'inprogress': return '#4ecdc4';
        case 'done': return '#45b7d1';
        default: return '#95a5a6';
      }
    };

    const getPriorityColor = (priority: string = 'medium') => {
      switch (priority) {
        case 'high': return '#e74c3c';
        case 'medium': return '#f39c12';
        case 'low': return '#27ae60';
        default: return '#bdc3c7';
      }
    };

    return (
      <div className="board">
        <div className="board-header">
          <h1>My Kanban Board</h1>
          <p>Drag and drop cards to organize your tasks</p>
          <div className="status-legend">
            <div className="legend-item">
              <span className="color-dot" style={{backgroundColor: '#ff6b6b'}}></span>
              <span>To Do</span>
            </div>
            <div className="legend-item">
              <span className="color-dot" style={{backgroundColor: '#4ecdc4'}}></span>
              <span>In Progress</span>
            </div>
            <div className="legend-item">
              <span className="color-dot" style={{backgroundColor: '#45b7d1'}}></span>
              <span>Done</span>
            </div>
          </div>
        </div>
        
        <div className="columns-container">
          {columns.map(column => (
            <div
              key={column.id}
              id={column.id}
              className="column-wrapper"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="column" style={{ borderTop: `4px solid ${getStatusColor(column.id)}` }}>
                <div className="column-header">
                  <h3>{column.title}</h3>
                  <span className="card-count">
                    {cards.filter(card => card.columnId === column.id).length}
                  </span>
                </div>
                
                <div className="cards-list">
                  {cards
                    .filter(card => card.columnId === column.id)
                    .map(card => (
                      <div
                        key={card.id}
                        className="card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id)}
                      >
                        <div className="card-header">
                          <h4>{card.title}</h4>
                          <button 
                            className="delete-card-btn"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="card-meta">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(card.status) }}
                          >
                            {card.status}
                          </span>
                          {card.priority && (
                            <span 
                              className="priority-badge"
                              style={{ backgroundColor: getPriorityColor(card.priority) }}
                            >
                              {card.priority}
                            </span>
                          )}
                        </div>

                        <div className="card-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => {
                              const newTitle = prompt('Edit title:', card.title);
                              if (newTitle) {
                                handleUpdateCard(card.id, { 
                                  title: newTitle,
                                });
                              }
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="add-card-section">
                  <input
                    type="text"
                    placeholder="+ Add a card..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        handleAddCard(column.id, input.value);
                        input.value = '';
                      }
                    }}
                    className="add-card-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="debug-info">
          <h4>Current Cards Status:</h4>
          {cards.map(card => (
            <div key={card.id} className="debug-card">
              <span><strong>{card.title}</strong></span>
              <span>Status: {card.status}</span>
              <span>Column: {card.columnId}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Board;