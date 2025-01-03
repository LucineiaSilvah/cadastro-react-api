import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const url = "https://api-servidor-3cno.onrender.com/api/users";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [telefone, setTelefone] = useState("");
  const [id, setId] = useState("");
  const inputRef = useRef(null);
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setIsValid(validateEmail(email));
  };

  //funcao para buscar api
  useEffect(() => {
    const buscaDados = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    buscaDados();
  }, []);

  //post

  const enviarDados = async (e) => {
    e.preventDefault();
    if(isValid === true){
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nome,
            email: email,
            telefone: telefone,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Dados enviados com sucesso:", data);
        // Atualiza a lista de usuários após o envio
        setData((prevData) => [...prevData, data]);
        setNome("");
        setEmail("");
        setTelefone("");
        setIsValid("");
      } catch (error) {
        console.error("Erro ao enviar dados:", error.message);
      }
    }
    
    
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Erro ao excluir: ${res.status}`);
      }
      setData((prevData) => prevData.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error("nao foi possivel deletar usuario", error.message);
    }
  };
  const atualizar = async (id) => {
    try {
      const res = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ao atualizar dados: ${res.status}`);
      }

      const userUpdate = await res.json();
      setData((prevData) =>
        prevData.map((usuario) => (usuario.id === id ? userUpdate : usuario))
      );
      console.log("Usuário atualizado com sucesso:", userUpdate);
      setNome("");
      setEmail("");
      setTelefone("");
      setIsValid("");
    } catch (error) {
      console.error("nao foi possivelatualizar dados", error.message);
    }
  };

  return (
    <>
      <header>
        <h1>cadastro</h1>
      </header>

      <h3>cadastrar usuario</h3>
      <main>
      <form>
        <label htmlFor="nome"> Nome </label>

        <input
          ref={inputRef}
          type="text"
          placeholder="digite seu nome"
          onChange={(e) => {
            setNome(e.target.value);
          }}
          value={nome}
        />

        <label htmlFor="email">E-mail </label>
        <input
          type="text"
          placeholder="digite seu email"
          onChange={handleChange}
          value={email}
        />
 {isValid === false && <p style={{ color: "red" }}>Email invalido</p>}
 {isValid === true && <p style={{ color: "green" }}>Email valido</p>}
        <label htmlFor="nome">telefone </label>
        <input
          type="telefone"
          placeholder="digite seu telefone"
          onChange={(e) => {
            setTelefone(e.target.value);

          }}
          value={telefone}
        />

        <button onClick={enviarDados}>cadastrar</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            atualizar(id, nome, email, telefone);
          }}
        >
          atualizar
        </button>
      </form>

    
        <div className="amostra">
          <h5>dados a serem enviados</h5>
          nome: {nome} <br />
          email {email}
          <br />
          telefone: {telefone}
        </div>
        <h2>Usuarios</h2>
        {loading ? (
          <p>carregando</p>
        ) : (
          <ul>
            {data.map((user) => (
              <li key={user.id}>
                {user.nome.toUpperCase()}
                <hr />
                {user.email}
                <hr />
                {user.telefone}
                <hr />
                <button
                  className="del"
                  onClick={() => {
                    deleteUser(user.id);
                  }}
                >
                  deletar
                </button>
                <button
                  className="edit"
                  onClick={() => {
                    // Dá foco ao input
                    let id = user.id;
                    setId(id);
                    inputRef.current.focus();
                  }}
                >
                  editar
                </button>
              </li>
            ))}
          </ul>
        )}{" "}
      </main>
    </>
  );
}

export default App;
