// import firebase from 'firebase/compat/app';
import 'firebase/messaging';

export function TesteNotification() {

    const sendNotification = () => {
        fetch('http://localhost:3333/message', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
              title: 'Notificação HTTP',
              body: 'Sucesso!',
              deviceToken: 'dK4qKayCSzWwoX5N1VTC0_:APA91bEqafHpAxbW-gYTdnFwffhRGdTFp3-MKAL--VU3AsdbJ8vOEP4EG0EAh3z3s_-cXHRwL_ekVdtMzjlRLXkiVv9Bb3CC_ETWKxhoxblLD4vneHZnDMSfUWm98zDpB_7iIWjUUiwi', 
          }),
        })
        .then(response => console.log('Resposta:', response))
        .catch(error => console.error('Erro ao enviar notificação:', error));
      }



    return (
        <>
            <h1>teste notificação</h1>
            <button onClick={sendNotification}>Enviar notificação</button>
        </>
    );

}