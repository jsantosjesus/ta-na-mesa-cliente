import MenuBottom from "../../components/menuBottom";
import { useContext } from "react";
import { DocsContext } from "../../contexts/docsContext";

function Pedidos() {


    const { pedidos } = useContext(DocsContext);


    return (
        <div className="bodyPedidos">
            <MenuBottom page='pedidos' />
            <h3>Pedidos</h3>
            <div>
                {pedidos && pedidos.map((pedido, index) => {
                    return (<div key={index}>
                        <h4>
                        Seu pedido 
                        {pedido.status === 'cancelado' && ' foi cancelado'}
                        {pedido.status === 'aguardando' && ' está aguardando aprovação'}
                        {pedido.status === 'fila' && ' está na fila'}
                        {pedido.status === 'producao' && ' está sendo produzido'}
                        {pedido.status === 'pronto' && ' está Pronto'}
                        </h4>
                        <p>pedido por {pedido.usuario}</p>
                    </div>)
                })}
            </div>

        </div>
    )
} export default Pedidos