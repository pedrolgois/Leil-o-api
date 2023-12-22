"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Leilao, formatMoney, formatarDataParaExibicao } from "../lib/data";
import { ToastContainer, toast } from "react-toastify";

// Styles
import styles from "./page.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedLeilao, setSelectedLeilao] = useState(null);
  const [user, setUser] = useState({ name: "", cpf: "" });

  const [leiloes, setLeiloes] = useState<Leilao[]>([]);

  async function getLeiloes() {
    const response = await fetch("/api/leiloes");
    const data = await response.json();
    setLeiloes(data.leiloes);
  }

  useEffect(() => {
    getLeiloes();
    setUser(JSON.parse(window.localStorage.getItem("user") || "{name: ''}}"));
  }, []);

  return (
    <>
      <div className={styles.leilao}>
        <div>
          <header>
            <h1>Leilão</h1>
            <h2>
              Bem vindo <span>{user.name}</span>
            </h2>
          </header>
          <main>
            <div>
              <ItemForm refresh={getLeiloes} />
            </div>
            <div>
              <ItemList leiloes={leiloes} setLeilao={setSelectedLeilao} />
            </div>
          </main>
        </div>
      </div>
      <LoginModal
        modalOpen={isLoginModalOpen}
        setModalOpen={setIsLoginModalOpen}
      />
      <LeilaoModal
        selectedLeilao={selectedLeilao}
        setSelectedLeilao={setSelectedLeilao}
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

function LeilaoModal({
  selectedLeilao,
  setSelectedLeilao,
}: {
  selectedLeilao: Leilao | null;
  setSelectedLeilao: Function;
}) {
  const [lance, setLance] = useState("0");
  const [user, setUser] = useState({ name: "", cpf: "" });

  useEffect(() => {
    setUser(
      JSON.parse(window.localStorage.getItem("user") || "{name: '', cpf: ''}")
    );
  }, []);
  const maiorLance = selectedLeilao?.lances.reduce(
    (prev, current) => {
      return prev.value > current.value ? prev : current;
    },
    { value: 0, participant: { name: "" } }
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const participant = user;
    const novolance = {
      value: lance,
      participant,
    };
    await fetch(`/api/leiloes/${selectedLeilao?.id}/lances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novolance),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Lance cadastrado com sucesso");
        setSelectedLeilao(data.leilao);
      });
  }
  return (
    <div
      className={[styles.leilaoModal, !selectedLeilao && styles.closed].join(
        " "
      )}
    >
      <div>
        <button
          className={styles.close}
          onClick={() => setSelectedLeilao(null)}
        >
          x
        </button>
        <h2>Leilão</h2>
        <div className={styles.info}>
          <img src={"https://cdn-icons-png.flaticon.com/512/234/234707.png"} />
          <div>
            <h3>{selectedLeilao?.item.name || ""}</h3>
            <p>{selectedLeilao?.item.description || ""}</p>
            <small>
              Limite:{" "}
              {formatarDataParaExibicao(
                new Date(selectedLeilao?.horarioLimite || "")
              )}
            </small>
            <br />
            <small>Status: {selectedLeilao?.item.status || ""}</small>
          </div>
        </div>
        <h2>Lances</h2>

        <div className={styles.lances}>
          <form onSubmit={handleSubmit}>
            <div>
              <input type="number" onChange={(e) => setLance(e.target.value)} />
              <button type="submit">Dar Lance</button>
            </div>
            <small>
              Lance Mínimo: R$
              {formatMoney(selectedLeilao?.item.minimumValue || 0)}
            </small>
            <small>
              Maior lance: R$ {formatMoney(maiorLance?.value || 0)} (
              {maiorLance?.participant.name})
            </small>
          </form>
          {selectedLeilao?.lances.map((lance) => (
            <div key={lance.id} className={styles.lance}>
              <div>
                <h3>{lance.participant.name}</h3>
              </div>
              <p>R$ {formatMoney(lance.value)}</p>
            </div>
          ))}
        </div>
        <div className={styles.lances}></div>
      </div>
    </div>
  );
}

// Lista de itens cadastrados

function ItemList({
  leiloes,
  setLeilao,
}: {
  leiloes: Leilao[];
  setLeilao: Function;
}) {

  return (
    <div>
      <h2>Itens</h2>
      {leiloes.map((leilao) => (
        <div
          key={leilao.id}
          onClick={() => setLeilao(leilao)}
          className={styles.item}
        >
          <img
            src={"https://cdn-icons-png.flaticon.com/512/234/234707.png"}
            alt={leilao.item.name}
          />
          <div>
            <h3>{leilao.item.name}</h3>
            <p>{leilao.item.description}</p>
            <small>
              Limite: {formatarDataParaExibicao(new Date(leilao.horarioLimite))}
            </small>
            <br />
            <small>Status: {leilao.item.status}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

// Formulário de cadastro de item

function ItemForm({ refresh }: { refresh: Function }) {
  const defaultItem = {
    name: "",
    description: "",
    minimumValue: 0,
    horarioLimite: "",
  };
  const [item, setItem] = useState(defaultItem);

  const handleItem = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmitItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch("/api/itens", {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          const newItem = data.item;
          const horarioLimite = new Date(item.horarioLimite);
          console.log(horarioLimite, item);
          const leilaoBody = {
            itemId: newItem.id,
            horarioLimite,
          };
          await fetch("api/leiloes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(leilaoBody),
          })
            .then((res) => res.json())
            .then((data) => {
              toast.success("Item cadastrado com sucesso");
            });
          refresh();
          setItem(defaultItem);
        });
    } catch (err) {
      toast.error("Erro ao cadastrar item");
    }
  };

  return (
    <form onSubmit={handleSubmitItem} className={styles.form}>
      <h2>Cadastrar Item</h2>
      <div>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          name="name"
          value={item.name}
          required
          onChange={handleItem}
        />
      </div>
      <div>
        <label htmlFor="description">Descrição</label>
        <input
          type="text"
          name="description"
          value={item.description}
          required
          onChange={handleItem}
        />
      </div>
      <div>
        <label htmlFor="minimumValue">Valor mínimo R$</label>
        <input
          type="number"
          name="minimumValue"
          value={item.minimumValue}
          required
          onChange={handleItem}
        />
      </div>
      <div>
        <label htmlFor="horarioLimite">Data limite para leilão</label>
        <input
          type="datetime-local"
          name="horarioLimite"
          onChange={handleItem}
          value={item.horarioLimite}
          required
        />
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
}

// Modal de Login para o leilão

function LoginModal({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: Function;
}) {
  const defaultUser = {
    name: "",
    cpf: "",
  };
  const [user, setUser] = useState(defaultUser);

  function handleUser(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.localStorage.setItem("user", JSON.stringify(user));
    setModalOpen(false);
    setUser(defaultUser);
  }
  return (
    <div className={[styles.loginModal, !modalOpen && styles.closed].join(" ")}>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={user.name}
            onChange={handleUser}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={user.cpf}
            onChange={handleUser}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
