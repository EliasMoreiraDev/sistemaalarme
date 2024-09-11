import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from "../layouts/Message";
import styles from './Time.module.css';
import Container from '../layouts/Container';
import TimeCard from "../alarms/TimeCard";
import Loading from "../layouts/Loading";
import NoTimes from "../layouts/NoTime";
import HorarioReal from "../layouts/HorarioReal";
import NewTime from "./NewTime";
import Confirmacao from "../layouts/Confirmacao";
import DiasDeAlarme from "../layouts/DiasDeAlarme";

function Time() {
  const [times, setTimes] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [timeMessage, setTimeMessage] = useState('');
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalConfOpen, setIsModalConfOpen] = useState(false);

  const location = useLocation();
  let message = '';

  if (location.state?.message && !timeMessage) {
    message = location.state.message;
    setTimeMessage(message);
    window.history.replaceState({}, document.title);
  }

  useEffect(() => {
    setTimeout(() => {
      fetch('http://192.168.2.37:5000/alarms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setTimes(data);
          setRemoveLoading(true);
        })
        .catch((err) => console.log(err));
    }, 1500);
  }, []);

  function removeTime(id) {
    fetch(`http://192.168.2.37:5000/alarms/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        setTimes(times.filter((time) => time.id !== id));
        setTimeMessage('Alarme removido com sucesso!');
      })
      .catch((erro) => console.log(erro));
  }

  const openModalAdd = () => setIsModalAddOpen(true);
  const closeModalAdd = () => setIsModalAddOpen(false);

  const openModalConf = () => setIsModalConfOpen(true);
  const closeModalConf = () => setIsModalConfOpen(false);

  // Função para adicionar um alarme
  const addTime = (newTime) => {
    setTimes((prevTimes) => [...prevTimes, newTime]);
  };

  return (
    <div className={styles.project_container}>
      <HorarioReal />
      <NewTime isOpen={isModalAddOpen} onClose={closeModalAdd} addTime={addTime} />

      <Confirmacao isOpen={isModalConfOpen} onClose={closeModalConf} onConfirm={closeModalConf} text="Deseja tocar a sirene agora?" />

      <div className={styles.title_container}>
        <div className={styles.caixaBotoes}>
          <button className={styles.botaoCriar} onClick={openModalAdd}>Adicionar Horário</button>
          <button className={styles.botaoTocarAgora} onClick={openModalConf}>Tocar Agora</button>
        </div>
        <DiasDeAlarme />
        <h1>Alarmes</h1>
      </div>

      {message && <Message type="success" msg={message} />}
      {timeMessage && <Message type="success" msg={timeMessage} />}
      
      <Container customClass="column">
        {times.length > 0 &&
          times.map((time) => <TimeCard id={time.id} key={time.id} time={time.time} handleRemove={removeTime} />)}

        {!removeLoading && <Loading />}

        {removeLoading && times.length === 0 && <NoTimes />}
      </Container>
    </div>
  );
}

export default Time;
