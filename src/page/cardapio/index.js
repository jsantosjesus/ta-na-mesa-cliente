import { useContext } from "react";
import { DocsContext } from "../../contexts/docsContext";
import './cardapio.css';
import MenuBottom from "../../components/menuBottom";

function Cardapio() {
    const { estabelecimento, mesa } = useContext(DocsContext);

return (
    <div className='bodyCardapio'>
        <MenuBottom />
        <div className='headCardapio'>
            <div className='titleCardapio'>
                <h1>{estabelecimento.nome}</h1>
            </div>

            <div className='pesquisaCardapio'>
                <input type="text" placeholder="Pesquise aqui" 
                // value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                ></input>
            </div>
            {/* <div className='categorias'>
                <div 
                // onClick={() => escolherCategoria('todos')}
                    className={
                        'todos' === selecionado ? 'categoriaAtivo' : 'categoriaInativo'
                    }>
                    Todos
                </div>
                {categorias.map((categorias, index) => (

                    <div onClick={() => escolherCategoria(categorias.nome)}
                        key={categorias.nome}
                        className={
                            categorias.nome === selecionado ? 'categoriaAtivo' : 'categoriaInativo'
                        }>
                        {categorias.nome}
                    </div>

                ))}
            </div> */}
        </div>
        <div className='produtosCardapio'>
            {/* {filteredData.map((object, id) => (
                <div>
                    <div className="produtos"
                        // onClick={() => handleClick(object)}
                    >

                        <img className='produtoImagem' src={object.imagem} alt='imagem do produto' />
                        <div>
                            <h3>{object.nome}</h3>
                            <p className="produtoDescricao">{object.Descricao}</p>
                            <p className='produtoPreco'>R$ {object.preco.toFixed(2).replace(".", ",")}</p>
                        </div>
                    </div>
                    <Popup object={object} />
                </div>

            )

            )
            } */}
        </div>
    </div>
);

} export default Cardapio;
