"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLeilaoModalOpen, setIsLeilaoModalOpen] = useState(false);

  const user = JSON.parse(window.localStorage.getItem("user") || "{name: ''}}");
  return (
    <div className={styles.leilao}>
      <div>
        <header>
          <h1>Leilão</h1>
          <h2>Bem vindo {user.name}</h2>
        </header>
        <main>
          <div>
            <ItemForm />
          </div>
          <div></div>
        </main>
      </div>
      <LoginModal
        modalOpen={isLoginModalOpen}
        setModalOpen={setIsLoginModalOpen}
      />
    </div>
  );
}

function ItemForm() {
  const defaultItem = {
    name: "",
    description: "",
    minimumValue: 0,
  };
  const [item, setItem] = useState(defaultItem);

  const handleItem = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmitItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      fetch("/api/item", {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
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
        <label htmlFor="minimumValue">Valor mínimo</label>
        <input
          type="number"
          name="minimumValue"
          value={item.minimumValue}
          required
          onChange={handleItem}
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
