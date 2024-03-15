import React, { useState } from 'react';
import { useEffect } from 'react';
import styles from './ToggleSwitch.module.css'; // Importe seu arquivo CSS para estilização

function ToggleSwitch({id}){

  const [toggle, setToggle] = useState([])

  useEffect(() => {
          fetch('http://localhost:5000/alarms',{
              method: 'GET',
              headers: {
              'Content-Type': 'application/json'
          }
          }).then(resp => resp.json())
          .then((data) => {
            setToggle(data)
          })
          .catch((err) => console.log(err))
  },[])

     function handleClick(id){ 
       // Clonando o array para evitar mutações diretas no estado
        const updatedAlarmeAtivo = [...toggle];
        console.log("abaixo aqui")
        console.log(toggle)
        updatedAlarmeAtivo[id].ativo = !updatedAlarmeAtivo[id].ativo;

        setToggle(updatedAlarmeAtivo)

        // Enviando os dados atualizados de volta para o servidor local (depende de sua configuração no servidor)
        fetch(`http://localhost:5000/alarms/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: updatedAlarmeAtivo[id].ativo }),
        });
      };
   
     return (
       <div>
          <button className={`${styles.btn} ${toggle[id] && toggle[id].ativo ? styles.ativado : ''}`}
          onClick={() => handleClick(id)}> 
            <div className={styles.slider}></div>
          </button>
        
      </div>
   );
  
  };
export default ToggleSwitch; 