import styles from "./Alarm.module.css";
import { useState, useEffect } from "react";
import AlarmForm from "../alarms/TimeForm";

function Projeto({ isOpen, onClose, id, onUpdate }) {
  const [alarm, setAlarm] = useState([]);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    let isMounted = true;

    fetch(`http://192.168.2.27:5000/alarms/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (isMounted) setAlarm(data);
      })
      .catch((erro) => console.log(erro));

    return () => {
      isMounted = false;
    };
  }, [id]);

  function editPost(alarm) {
    setMessage('');

    fetch(`http://192.168.2.27:5000/alarms/${alarm.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alarm),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setAlarm(data);
        setType('success');
        setMessage('Projeto atualizado!');
        onClose(); 
        onUpdate(data); 
      })
      .catch((erro) => console.log(erro));
  }

  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal}>
        <AlarmForm handleSubmit={editPost} alarmdate={alarm} onClose={onClose} />
      </div>
    </div>
  );
}

export default Projeto;
