import MenuBottom from "../../components/menuBottom";
import { useContext, useState } from "react";
import { DocsContext } from "../../contexts/docsContext";
import aguardandoAprovacao from '../../assets/aguardandoAprovacao.png';
import pedidoEmFila from '../../assets/pedidoEmFila.png';
import pedidoCancelado from '../../assets/pedidoCancelado.png';
import pedidoPronto from '../../assets/pedidoPronto.png';
import produzindo from '../../assets/produzindo.png';
import './pedidos.css';
import Pedido from "../../components/pedido";

function Pedidos() {


    const { pedidos } = useContext(DocsContext);
    const [pedidoEscolhido, setPedidoEscolhido] = useState();


    return (
        <div>
            {pedidoEscolhido && <Pedido pedido={pedidoEscolhido} fecharPedido={() => setPedidoEscolhido(null)} />}

            <div className="bodyPedidos">
                <MenuBottom page='pedidos' />
                <h2>Pedidos</h2>
                <div>
                    {pedidos && pedidos.map((pedido, index) => {
                        return (<div key={index} className="divPedido" onClick={() => setPedidoEscolhido(pedido)}>
                            <div>
                                {pedido.status === 'cancelado' && <img src={pedidoCancelado} height='80px' alt={`pedido ${pedido.status}`} />}
                                {pedido.status === 'aguardando' && <img src={aguardandoAprovacao} height='80px' alt={`pedido ${pedido.status}`} />}
                                {pedido.status === 'fila' && <img src={pedidoEmFila} height='80px' alt={`pedido ${pedido.status}`} />}
                                {pedido.status === 'producao' && <img src={produzindo} height='80px' alt={`pedido ${pedido.status}`} />}
                                {pedido.status === 'pronto' && <img src={pedidoPronto} height='80px' alt={`pedido ${pedido.status}`} />}
                            </div>
                            <div className="informacoesPedidoPedidos">
                                {pedido.status === 'cancelado' && <h3 style={{ color: '#de3737' }}>Cancelado</h3>}
                                {pedido.status === 'aguardando' && <h3 style={{ color: '#f4c01e' }}>Aguardando aprovação</h3>}
                                {pedido.status === 'fila' && <h3 style={{ color: '#5e17eb' }}>Em fila</h3>}
                                {pedido.status === 'producao' && <h3 style={{ color: '#914f16' }}>Produzindo</h3>}
                                {pedido.status === 'pronto' && <h3 style={{ color: '#14b800' }}>Pronto</h3>}
                                <p>pedido por {pedido.usuario}</p>
                                <p className="totalPedidoPedidos"><b>R${pedido.total.toFixed(2).replace(".", ",")}</b></p>
                            </div>
                        </div>)
                    })}
                </div>
            </div>
        </div>
    )
} export default Pedidos