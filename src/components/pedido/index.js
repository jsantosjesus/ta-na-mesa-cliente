import { FaChevronLeft } from "react-icons/fa";
import './pedido.css';
import aguardandoAprovacao from '../../assets/aguardandoAprovacao.png';
import pedidoEmFila from '../../assets/pedidoEmFila.png';
import pedidoCancelado from '../../assets/pedidoCancelado.png';
import pedidoPronto from '../../assets/pedidoPronto.png';
import produzindo from '../../assets/produzindo.png';


function Pedido({ pedido, fecharPedido }) {
    return (
        <div className="bodyPedido">
            <p onClick={fecharPedido} className='fecharPedido'><FaChevronLeft /></p>
            <div style={{ marginTop: '30px' }}>
                {pedido.status === 'cancelado' && <img src={pedidoCancelado} height='80px' style={{ borderRadius: '40px' }} alt={`pedido ${pedido.status}`} />}
                {pedido.status === 'aguardando' && <img src={aguardandoAprovacao} height='80px' style={{ borderRadius: '40px' }} alt={`pedido ${pedido.status}`} />}
                {pedido.status === 'fila' && <img src={pedidoEmFila} height='80px' style={{ borderRadius: '40px' }} alt={`pedido ${pedido.status}`} />}
                {pedido.status === 'producao' && <img src={produzindo} height='80px' style={{ borderRadius: '40px' }} alt={`pedido ${pedido.status}`} />}
                {pedido.status === 'pronto' && <img src={pedidoPronto} height='80px' style={{ borderRadius: '40px' }} alt={`pedido ${pedido.status}`} />}
            </div>
            {pedido.status === 'cancelado' && <h3 style={{ color: '#de3737' }}>CANCELADO</h3>}
            {pedido.status === 'aguardando' && <h3 style={{ color: '#f4c01e' }}>AGUARDANDO APROVAÇÃO</h3>}
            {pedido.status === 'fila' && <h3 style={{ color: '#5e17eb' }}>EM FILA</h3>}
            {pedido.status === 'producao' && <h3 style={{ color: '#914f16' }}>PRODUZINDO</h3>}
            {pedido.status === 'pronto' && <h3 style={{ color: '#14b800' }}>PRONTO</h3>}

            <p>Feito por {pedido.usuario}</p>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent:  'space-around' }}>
                <b><p>Total</p></b><b><p>R${pedido.total.toFixed(2).replace(".", ",")}</p></b>
            </div>
            <div>
                {pedido.produtos.map((produto, index) => {
                    return (<div key={index} className="produtosPedido">
                        <p style={{fontSize: '22px', margin: '5px'}}>{`${produto.quantidade}x ${produto.nome}`}</p>
                        <p style={{marginLeft: '15px', marginTop: '5px', marginBottom: '5px'}}>{produto.observacao}</p>

                        <p style={{marginLeft: '15px', marginTop: '5px'}}>{produto.variacoes && produto.variacoes.map((variacao, index) => {
                            return(
                                <span key={index}>
                                    {`${variacao.nome}: `}
                                    {variacao.opcoes.map((opcao, index) => {
                                        return(
                                            <span key={index}>
                                                {`${opcao.nome}, `}
                                            </span>
                                        )
                                    })}
                                </span>
                            )
                        })}</p>

                        <p className="precoProdutoPedido">R${produto.preco.toFixed(2).replace(".", ",")}</p>
                        <p className="precoProdutoPedido"><b>R${(produto.quantidade * produto.preco).toFixed(2).replace(".", ",")}</b></p>
                        </div>)
                })}
            </div>

        </div>
    )
} export default Pedido