import styles from './NewTime.module.css';
import TimeForm from '../alarms/TimeForm';
import { useNavigate } from 'react-router-dom';

function NewTime({ isOpen, onClose, addTime }) {
  const navigate = useNavigate();

  function createPost(alarm) {
    fetch('http://192.168.2.27:5000/alarms', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(alarm),
    })
      .then((resp) => resp.json())
      .then((newAlarm) => {
        addTime(newAlarm);
        navigate('/times', { state: { message: 'Alarme programado com sucesso!' } });
        onClose();
      })
      .catch((erro) => console.log(erro));
  }

  if (!isOpen) return null;

  return (
    <div className={styles.caixa_newProject}>
      <div className={styles.modal_overlay}>
        <div className={styles.modal}>
          <h1 className={styles.titulo}>Criar Alarme</h1>
          <TimeForm handleSubmit={createPost} onClose={onClose} textobtn="Criar projeto" />
        </div>
      </div>
    </div>
  );
}

export default NewTime;
