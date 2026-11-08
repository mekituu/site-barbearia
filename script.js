
/* =====================================
   BARBEARIA IMPERIAL
   SISTEMA DE AGENDAMENTO
===================================== */

const formulario = document.getElementById("form-agendamento");
const campoData = document.getElementById("data");
const campoHorario = document.getElementById("horario");
const confirmacao = document.getElementById("confirmacao");

// WhatsApp da barbearia
const numero = "5563981211526";

/* =====================================
   BLOQUEAR DATAS PASSADAS
===================================== */

function obterDataHoje() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function atualizarDataMinima() {
    campoData.min = obterDataHoje();
}

atualizarDataMinima();

campoData.addEventListener("focus", atualizarDataMinima);

/* =====================================
   BLOQUEAR SÁBADOS E DOMINGOS
===================================== */

function verificarDia() {
    const dataSelecionada = campoData.value;

    if (!dataSelecionada) return;

    const [ano, mes, dia] = dataSelecionada
        .split("-")
        .map(Number);

    const data = new Date(ano, mes - 1, dia);
    const diaSemana = data.getDay();

    if (diaSemana === 0 || diaSemana === 6) {
        alert("A barbearia funciona apenas de segunda a sexta!");
        campoData.value = "";
    }
}

/* =====================================
   BLOQUEAR HORÁRIOS PASSADOS
===================================== */

function atualizarHorarios() {
    const agora = new Date();
    const dataEscolhida = campoData.value;

    const horaAtual =
        agora.getHours() * 60 + agora.getMinutes();

    const opcoes = campoHorario.querySelectorAll("option");

    opcoes.forEach(function(opcao) {
        if (!opcao.value) return;

        const [horas, minutos] = opcao.value
            .split(":")
            .map(Number);

        const horarioEmMinutos = horas * 60 + minutos;

        opcao.disabled =
            dataEscolhida === obterDataHoje() &&
            horarioEmMinutos <= horaAtual;
    });

    if (campoHorario.selectedOptions[0]?.disabled) {
        campoHorario.value = "";
    }
}

campoData.addEventListener("change", function() {
    atualizarDataMinima();
    verificarDia();
    atualizarHorarios();
});

campoHorario.addEventListener("focus", atualizarHorarios);

atualizarHorarios();

/* =====================================
   MOSTRAR RESUMO DO AGENDAMENTO
===================================== */

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    atualizarDataMinima();
    verificarDia();
    atualizarHorarios();

    if (!formulario.reportValidity()) return;

    const servico = document.getElementById("servico").value;
    const data = campoData.value;
    const horario = campoHorario.value;

    if (!data || !horario) return;

    const [ano, mes, dia] = data.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    document.getElementById("resumo-servico").textContent =
        "✂️ Serviço: " + servico;

    document.getElementById("resumo-data").textContent =
        "📅 Data: " + dataFormatada;

    document.getElementById("resumo-horario").textContent =
        "⏰ Horário: " + horario;

    confirmacao.hidden = false;

    confirmacao.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

/* =====================================
   CONFIRMAR PELO WHATSAPP
===================================== */

document.getElementById("confirmar-whatsapp")
.addEventListener("click", function() {

    const servico = document.getElementById("servico").value;
    const data = campoData.value;
    const horario = campoHorario.value;

    atualizarDataMinima();
    verificarDia();
    atualizarHorarios();

    if (!formulario.reportValidity()) {
        confirmacao.hidden = true;
        return;
    }

    const [ano, mes, dia] = data.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const mensagem = `Olá! Gostaria de agendar um horário na Barbearia Exu's Barber.

💈 Serviço: ${servico}
📅 Data: ${dataFormatada}
⏰ Horário: ${horario}

Gostaria de confirmar a disponibilidade.`;

    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(link, "_blank", "noopener,noreferrer");
});

/* =====================================
   BOTÃO VOLTAR
===================================== */

document.getElementById("cancelar-agendamento")
.addEventListener("click", function() {

    confirmacao.hidden = true;

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});
