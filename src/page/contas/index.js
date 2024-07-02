import { useContext } from "react";
import { DocsContext } from "../../contexts/docsContext";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import './contas.css';
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { FirebaseContext } from "../../contexts/appContext";

function Contas() {


    const app = useContext(FirebaseContext);
    const db = getFirestore(app);

    const { pedidos, mesa, tokenGarcom } = useContext(DocsContext);
    let total = 0;

    const sendMessage = () => {
        fetch('https://ta-na-mesa-api-qb85.onrender.com/message', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
              title: `CONTA DE MESA ${mesa.numero}`,
              body: `A mesa ${mesa.numero} está pedindo a conta!`,
              deviceToken: tokenGarcom
            }),
        })
        .then(response => console.log('Resposta:', response))
        .catch(error => console.error('Erro ao enviar notificação:', error));
      };

    const pedirConta = async () => {
        let chamado;
        try {
            const docRef = await addDoc(collection(db, "chamado"), {
                estabelecimento_id: mesa.estabelecimento_id,
                garcom_id: mesa.garcom_id,
                mesa: {
                    id: mesa.id,
                    numero: mesa.numero
                },
                hora: new Date(),
                tipo: 'conta',
                status: "ATIVO"
            });
            chamado = docRef.id;
            await updateDoc(doc(db, "mesa", mesa.id), {
                chamandoGarcom: chamado,
            });

            sendMessage();

        } catch (error) {
            console.error("Erro ao criar documento:", error);
        }
    }

    const cancelarPedirConta = async () => {
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
        <div>
            <Link to='/cardapio'><p className='fecharConta'><FaChevronLeft /></p></Link><h3 className="titleConta">Conta</h3>
            <div className="ProdutosConta">
                {mesa.contaAtiva && pedidos && pedidos.map((pedido, index) => {
                    if (pedido.status !== "cancelado") {
                        total = total + pedido.total;
                        return (
                            <span key={index}>
                                {pedido.produtos.map((produto, index) => {
                                    return (
                                        <div key={index} className="divProdutoConta">
                                            <span>
                                                <p style={{ marginBottom: '5px' }}>{`${produto.quantidade}x - ${produto.nome}`}</p>
                                                <p style={{ marginTop: '5px' }}>({pedido.usuario})</p>
                                            </span>
                                            <p style={{ textAlign: 'end' }}>R${(produto.quantidade * produto.preco).toFixed(2).replace(".", ",")}</p>
                                        </div>
                                    )
                                })}
                            </span>
                        )
                    } else{
                        return null;
                    }
                })}
            </div>
            <div className='footerConta'>
                <div className="footerContaTotal"><p>Total</p><p>R$ {total ? total.toFixed(2).replace(".", ",") : "0,00"}</p></div>
                {mesa.chamandoGarcom && <><button style={{ opacity: '0.5' }}>Chamando Garçom...</button><p onClick={cancelarPedirConta}>cancelar</p></>}
                {total > 0 && !mesa.chamandoGarcom && mesa.contaAtiva && <button onClick={pedirConta}>Pedir Conta</button>}
                {!total && !mesa.chamandoGarcom && <button style={{ opacity: '0.5' }}>Pedir Conta</button>}
            </div>
        </div>
    );
} export default Contas; 