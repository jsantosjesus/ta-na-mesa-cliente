import { useContext, useEffect, useState } from "react";
import { DocsContext } from "../../contexts/docsContext";
import './cardapio.css';
import MenuBottom from "../../components/menuBottom";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { FirebaseContext } from "../../contexts/appContext";
import imagemVaziaLogo from '../../assets/ta-na-mesa-logomarca.png';
import { Produto } from "../../components/produto";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function Cardapio() {
    const { estabelecimento, mesa } = useContext(DocsContext);

    const [loading, setLoading] = useState();

    const app = useContext(FirebaseContext);
    const db = getFirestore(app);

    const [categorias, setCategorias] = useState();
    const [categoriaSelecionada, setCategoriaSelecinada] = useState();

    const [produtos, setProdutos] = useState();
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    async function getCategorias() {
        const q = query(collection(db, "categoria"), where("estabelecimento_id", "==", mesa.estabelecimento_id));
        let firebaseCategorias = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            firebaseCategorias.push({ ...doc.data(), id: doc.id });

        });
        setCategorias(firebaseCategorias);
        setCategoriaSelecinada(firebaseCategorias[0]);
    }

    useEffect(() => {
        if (!categorias) {
            getCategorias();
        }
    });


    // useEffect(() => {
    //     if (categorias) {
    //         console.log(categoriaSelecionada);
    //     }
    // }, [categoriaSelecionada]);

    async function getProdutos() {
        if (categoriaSelecionada) {
            setLoading(true);
            const q = query(collection(db, "produto"), where("categoria_id", "==", categoriaSelecionada.id));
            let firebaseProdutos = [];
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                firebaseProdutos.push({ ...doc.data(), id: doc.id });

            });
            setLoading(false);
            setProdutos(firebaseProdutos);
        }
    }


    useEffect(() => {
        getProdutos();
        // eslint-disable-next-line
    }, [categoriaSelecionada]);



    return (
        <div className='bodyCardapio'>
            <MenuBottom page='cardapio'/>
            <div className='headCardapio'>
                <div className='titleCardapio'>
                    <h1>{estabelecimento.nome}</h1>
                </div>

                <div className='pesquisaCardapio'>
                    <input type="text" placeholder="Pesquise aqui"
                    // value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    ></input>
                </div>
                <div className='categorias'>
                    {categorias && categorias.map((categoria, index) => (

                        <div
                            onClick={() => setCategoriaSelecinada(categoria)}
                            key={index}
                            className={
                                categoria === categoriaSelecionada ? 'categoriaAtivo' : 'categoriaInativo'
                            }
                        >
                            {categoria.nome}
                        </div>

                    ))}
                </div>
            </div>
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '70vh' }}>
                <CircularProgress />
            </Box> : <div className='produtosCardapio'>
                {produtos && produtos.map((produto) => (
                    <div key={produto.id}>
                        <div className="produtos"
                            onClick={() => setProdutoSelecionado(produto)}
                            key={produto}
                        >

                            <img className='produtoImagem' src={produto.imagem ? produto.imagem : imagemVaziaLogo} alt='imagem do produto' />
                            <div>
                                <h3>{produto.nome}</h3>
                                <p className="produtoDescricao">{produto.descricao}</p>
                                <p className='produtoPreco'>R$ {produto.preco.toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>
                    </div>

                )

                )
                }
            </div>}
            {produtoSelecionado && <Produto produto={produtoSelecionado} handleClose={() => setProdutoSelecionado(null)} />}
        </div>
    );

} export default Cardapio;
