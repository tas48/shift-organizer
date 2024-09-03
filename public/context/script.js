import { obterFuncionarios, atualizarFuncionario } from './database.js';

let funcionarios = [];
let funcionariosFiltrados = []; // Adicionar uma variável para armazenar os funcionários filtrados

// Função para carregar os funcionários do Firestore
async function carregarFuncionariosDoFirestore() {
    funcionarios = await obterFuncionarios();
    const setorSalvo = restaurarSetor(); // Restaurar o setor salvo no localStorage
    filtrarPorSetor(setorSalvo); // Aplicar o filtro de setor salvo
    carregarFuncionarios(); // Carrega os funcionários nos selects
    restaurarEstadoTabela(); // Restaurar o estado após carregar os funcionários
    adicionarEventosDeMudanca(); // Adicionar eventos de mudança aos selects
}

// Função para carregar as opções de funcionários nos selects
function carregarFuncionarios() {
    const selects = document.querySelectorAll('.funcionario-select');

    selects.forEach(select => {
        const dia = select.getAttribute('data-dia');
        select.innerHTML = '<option value="">Selecione</option>'; // Opção padrão

        funcionariosFiltrados.forEach(funcionario => {
            if (funcionario.diasDisponiveis.includes(dia)) {
                const option = document.createElement('option');
                option.value = funcionario.nome;
                option.textContent = funcionario.nome;
                select.appendChild(option);
            }
        });
    });
}

// Função para restaurar o estado da tabela a partir do localStorage
function restaurarEstadoTabela() {
    const estadoSalvo = JSON.parse(localStorage.getItem('estadoTabela')) || {};

    const selects = document.querySelectorAll('.funcionario-select');

    selects.forEach(select => {
        const dia = select.getAttribute('data-dia');
        const linha = select.closest('tr').rowIndex;

        // Restaurar o estado salvo
        if (estadoSalvo[linha] && estadoSalvo[linha][dia]) {
            select.value = estadoSalvo[linha][dia];
        }
    });
}

// Função para adicionar eventos de mudança nos selects
function adicionarEventosDeMudanca() {
    const selects = document.querySelectorAll('.funcionario-select');
    selects.forEach(select => {
        select.addEventListener('change', salvarEstadoTabela);
    });
}

// Função para salvar o estado da tabela no localStorage
function salvarEstadoTabela() {
    const estadoTabela = {};
    const selects = document.querySelectorAll('.funcionario-select');

    selects.forEach(select => {
        const dia = select.getAttribute('data-dia');
        const linha = select.closest('tr').rowIndex;

        if (!estadoTabela[linha]) {
            estadoTabela[linha] = {};
        }

        estadoTabela[linha][dia] = select.value;
    });

    localStorage.setItem('estadoTabela', JSON.stringify(estadoTabela));
}

// Função para salvar o setor no localStorage
function salvarSetor(setor) {
    localStorage.setItem('setorSelecionado', setor);
}

// Função para restaurar o setor do localStorage
function restaurarSetor() {
    const setorSalvo = localStorage.getItem('setorSelecionado') || 'Todos';
    document.getElementById('filtro-setor').value = setorSalvo;
    return setorSalvo;
}

// Função para filtrar por setor
function filtrarPorSetor(setor) {
    salvarSetor(setor); // Salvar o setor no localStorage ao filtrar
    if (setor === 'Todos') {
        funcionariosFiltrados = [...funcionarios];
    } else {
        funcionariosFiltrados = funcionarios.filter(funcionario => funcionario.setor === setor);
    }
    carregarFuncionarios(); // Recarrega os funcionários no select ao filtrar por setor
    restaurarEstadoTabela(); // Restaurar o estado após filtrar
}

// Função para adicionar uma nova linha na tabela de escala
function adicionarLinhaEscala() {
    const tabela = document.getElementById('tabela-escala');
    const novaLinha = document.createElement('tr');

    // Criar uma célula para cada dia da semana
    for (let i = 0; i < 7; i++) {
        const dia = document.querySelector(`#escala thead th:nth-child(${i + 1})`).textContent;
        const td = document.createElement('td');
        const select = document.createElement('select');
        select.className = 'funcionario-select';
        select.setAttribute('data-dia', dia);

        // Preencher o select com opções de funcionários
        select.innerHTML = '<option value="">Selecione</option>'; // Opção padrão
        funcionariosFiltrados.forEach(funcionario => {
            if (funcionario.diasDisponiveis.includes(dia)) {
                const option = document.createElement('option');
                option.value = funcionario.nome;
                option.textContent = funcionario.nome;
                select.appendChild(option);
            }
        });

        td.appendChild(select);
        novaLinha.appendChild(td);
    }

    tabela.appendChild(novaLinha);
    adicionarEventosDeMudanca(); // Adicionar eventos de mudança nos selects da nova linha
}

// Função para remover a última linha da tabela de escala
function removerLinhaEscala() {
    const tabela = document.getElementById('tabela-escala');
    const linhas = tabela.querySelectorAll('tr');

    if (linhas.length > 0) {
        tabela.removeChild(linhas[linhas.length - 1]);
        salvarEstadoTabela(); // Salvar o estado após remover a linha
    }
}

// Função para inicializar a tabela com linhas já existentes
function adicionarLinhasIniciais(numLinhas) {
    for (let i = 0; i < numLinhas; i++) {
        adicionarLinhaEscala();
    }
}

// Função para limpar o localStorage
function limparLocalStorage() {
    localStorage.removeItem('estadoTabela'); // Remove o item específico usado para armazenar o estado
    localStorage.removeItem('setorSelecionado'); // Remove o setor salvo
    location.reload(); // Recarrega a página para resetar a tabela
}

// Inicializar
document.getElementById('adicionar-escala').addEventListener('click', adicionarLinhaEscala);
document.getElementById('remover-escala').addEventListener('click', removerLinhaEscala);
document.getElementById('filtro-setor').addEventListener('change', function() {
    const setorSelecionado = this.value;
    filtrarPorSetor(setorSelecionado);
});
document.getElementById('limpar-storage').addEventListener('click', limparLocalStorage); // Adiciona o evento para limpar o localStorage

// Carregar os funcionários do Firestore e inicializar a tabela
document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionariosDoFirestore().then(() => {
        adicionarLinhasIniciais(4); // Adicionar linhas iniciais
        restaurarEstadoTabela(); // Garantir que o estado seja restaurado após a criação das linhas
    });
});
