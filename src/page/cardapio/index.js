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

    const [searchTerm, setSearchTerm] = useState('');
    let searchTimer;

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


    async function getProdutos() {
        if (categoriaSelecionada) {
            setLoading(true);
            const q = query(collection(db, "produto"), where("categoria_id", "==", categoriaSelecionada.id), where("em_estoque", "==", true));
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
        if (!searchTerm) {
            getProdutos();
        }
        // eslint-disable-next-line
    }, [categoriaSelecionada, searchTerm]);

    const handleSearch = async () => {
        // Converter o termo de pesquisa para minúsculas
        const searchTermLower = searchTerm.toLowerCase();


        setLoading(true);
        const q = query(collection(db, "produto"), where("estabelecimento_id", "==", estabelecimento.id), where("em_estoque", "==", true));
        let firebaseProdutos = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            firebaseProdutos.push({ ...doc.data(), id: doc.id });
        });

        const results = firebaseProdutos.filter(result => result.nome.toLowerCase().includes(searchTermLower));

        setProdutos(results);
        setLoading(false);
    }


    const handleChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);

        // Cancelar o temporizador existente, se houver
        clearTimeout(searchTimer);

        // Definir um novo temporizador para atrasar a pesquisa
        searchTimer = setTimeout(() => {
            if (newSearchTerm.length >= 2) {
                handleSearch(); // Executa a busca se o termo de pesquisa tiver pelo menos três letras
            }
        }, 400); // Delay de 300 milissegundos
    };



    return (
        <div className='bodyCardapio'>
            <MenuBottom page='cardapio' />
            <div className='headCardapio'>
                <div className='titleCardapio'>
                    <h1>{estabelecimento.nome}</h1>
                </div>

                <div className='pesquisaCardapio'>
                    <input type="text" placeholder="Pesquise aqui"
                        value={searchTerm}
                        onChange={handleChange}
                    ></input>
                </div>
                <div className='categorias' style={searchTerm.length >= 2 ? {display: 'none'} : {}}>
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
