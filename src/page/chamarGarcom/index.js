import { useContext } from "react";
import { DocsContext } from "../../contexts/docsContext";
import MenuBottom from "../../components/menuBottom";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { FirebaseContext } from "../../contexts/appContext";
import './chamarGarcom.css';

function ChamarGarcom() {

    const {mesa} = useContext(DocsContext);

    
    const app = useContext(FirebaseContext);
    const db = getFirestore(app);

    const abrirChamadoGarcom = async () => {
        try {
            let chamado;
            const docRef = await addDoc(collection(db, "chamado"), {
                estabelecimento_id: mesa.estabelecimento_id,
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
                chamandoGarcom: false,
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