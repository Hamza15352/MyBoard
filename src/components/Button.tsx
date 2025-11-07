

import { useNavigate } from 'react-router-dom';

function Button() {
  const navigate = useNavigate();

  const goToTaskOverview = () => {
    navigate('/taskoverview');
  };

  return (
    <div>
      <button onClick={goToTaskOverview}>Task Overview</button>
    </div>
  );
}

export default Button;
