console.log("JS cargado");

// ====== Validar cartão ======
async function validarCartao(cartao) {
    const res = await fetch(`http://localhost:3000/usuarios/${cartao}`);
    if (!res.ok) {
        alert("Cartão não encontrado");
        return false;
    }
    const usuario = await res.json();
    console.log("Colaborador encontrado:", usuario);
    return true;
}

// ====== Ação dos botões ======
async function accion(tipo, mesa, linea) {
    const cartao = document.getElementById("cartao").value;
    const etiqueta = document.getElementById("etiqueta").value;

    if (!cartao || !etiqueta) {
        alert("Escaneie cartão e etiqueta");
        return;
    }

    const valido = await validarCartao(cartao);
    if (!valido) return;

    await fetch("http://localhost:3000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cartao: cartao,
            etiqueta: etiqueta,   // faltava enviar a etiqueta ao servidor
            tipo: tipo,
            mesa: mesa,
            linea: linea
        })
    });

    agregarRegistro(cartao, etiqueta, tipo, mesa, linea);  // passava o valor antes de limpar

    // Limpar campos
    document.getElementById("cartao").value = "";
    document.getElementById("etiqueta").value = "";
}

// ====== Adicionar linha à tabela ======
function agregarRegistro(cartao, etiqueta, tipo, mesa, linea) {
    const tabela = document.getElementById("tabela");
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-PT");
    const hora = agora.toLocaleTimeString("pt-PT");

    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${data}</td>
        <td>${tipo === "ENTRAR" ? hora : ""}</td>
        <td>${tipo === "SAIR" ? hora : ""}</td>
        <td>${etiqueta}</td>
        <td>${cartao}</td>
        <td>${tipo}</td>
    `;
    tabela.appendChild(fila);
}

// ====== Modal colaboradores ======
function abrirModal() {
    document.getElementById("modal").style.display = "flex";
    carregarColaboradores();
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

async function carregarColaboradores() {
    const res = await fetch("http://localhost:3000/usuarios");
    const usuarios = await res.json();
    const lista = document.getElementById("lista-colaboradores");
    lista.innerHTML = "";

    usuarios.forEach(u => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${u.id}</td>
            <td>${u.cartao}</td>
            <td>${u.nombre}</td>
            <td>${u.rol}</td>
            <td><button class="red" onclick="removerColaborador('${u.cartao}')">✕</button></td>
        `;
        lista.appendChild(fila);
    });
}

async function adicionarColaborador() {
    const cartao = document.getElementById("novo-cartao").value;
    const nombre = document.getElementById("novo-nome").value;
    const rol = document.getElementById("novo-rol").value;

    if (!cartao || !nombre || !rol) {
        alert("Preencha todos os campos");
        return;
    }

    await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartao, nombre, rol })
    });

    document.getElementById("novo-cartao").value = "";
    document.getElementById("novo-nome").value = "";
    document.getElementById("novo-rol").value = "";
    carregarColaboradores();
}

async function removerColaborador(cartao) {
    if (!confirm("Remover este colaborador?")) return;

    await fetch(`http://localhost:3000/usuarios/${cartao}`, {
        method: "DELETE"
    });

    carregarColaboradores();
}