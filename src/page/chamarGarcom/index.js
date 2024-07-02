import { useContext } from "react";
import { DocsContext } from "../../contexts/docsContext";
import MenuBottom from "../../components/menuBottom";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { FirebaseContext } from "../../contexts/appContext";
import './chamarGarcom.css';


function ChamarGarcom() {

    const {mesa, tokenGarcom} = useContext(DocsContext);

    
    const app = useContext(FirebaseContext);
    const db = getFirestore(app);


    const sendMessage = () => {
        fetch('https://ta-na-mesa-api-qb85.onrender.com/message', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
              title: `Chamado de mesa ${mesa.numero}`,
              body: `A mesa ${mesa.numero} precisa de ajuda com algo!`,
              deviceToken: tokenGarcom
            }),
        })
        .then(response => console.log('Resposta:', response))
        .catch(error => console.error('Erro ao enviar notificação:', error));
      };

    const abrirChamadoGarcom = async () => {
        try {
            let chamado;
            const docRef = await addDoc(collection(db, "chamado"), {
                estabelecimento_id: mesa.estabelecimento_id,
                garcom_id: mesa.garcom_id,
                mesa: {
                    id: mesa.id,
                    numero: mesa.numero
                },
                hora: new Date(),
                tipo: 'duvida',
                status: "ATIVO"
            });
            chamado = docRef.id
            await updateDoc(doc(db, "mesa", mesa.id), {
                chamandoGarcom: chamado,
            });

            sendMessage();
        } catch (error) {
            console.error("Erro ao criar documento:", error);
        }
    }

    const cancelarChamandoGarcom = async () => {
        try {
            await updateDoc(doc(db, "chamado", mesa.chamandoGarcom), {
                status: 'CANCELADO',
            }); 
            await updateDoc(doc(db, "mesa", mesa.id), {
                chamandoGarcom: '',
            });

        } catch (error) {
            console.error("Erro ao editar documento:", error);
        }
    }

    return (
        <div className="bodyChamarGarcom">
            <MenuBottom page='chamarGarcom' />

            {mesa.chamandoGarcom ?
                <div>
                    <h3 className="chamarGarcomParagrafo">Chamando...</h3>
                    <button className="buttonCancelarChamarGarcom" onClick={cancelarChamandoGarcom}>Cancelar</button>
                </div> :
                <div>
                    <h3 className="chamarGarcomParagrafo">Chamar Garçom?</h3>
                    <button className="buttonConfirmarChamarGarcom" onClick={abrirChamadoGarcom}>Confirmar</button>
                </div>}
        </div>
    );

} export default ChamarGarcom