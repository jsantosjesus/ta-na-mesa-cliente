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

    const { pedidos, mesa } = useContext(DocsContext);
    let total = 0;

    const pedirConta = async () => {
        let chamado;
        try {
            const docRef = await addDoc(collection(db, "chamado"), {
                estabelecimento_id: mesa.estabelecimento_id,
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
                chamandoGarcom: false,
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
                })}
            </div>
            <div className='footerConta'>
                <div className="footerContaTotal"><p>Total</p><p>R$ {mesa.contaAtiva && total ? total.toFixed(2).replace(".", ",") : "0,00"}</p></div>
                {mesa.chamandoGarcom && <><button style={{ opacity: '0.5' }}>Chamando Garçom...</button><p onClick={cancelarPedirConta}>cancelar</p></>}
                {!mesa.chamandoGarcom && mesa.contaAtiva && total && <button onClick={pedirConta}>Pedir Conta</button>}
                {!mesa.chamandoGarcom && !total && <button style={{ opacity: '0.5' }}>Pedir Conta</button>}
            </div>
        </div>
    );
} export default Contas; 