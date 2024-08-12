// script.js

import { obterFuncionarios, atualizarFuncionario } from './database.js';

let funcionarios = [];

// Função para carregar os funcionários do Firestore
async function carregarFuncionariosDoFirestore() {
    funcionarios = await obterFuncionarios();
    carregarFuncionarios(); // Carrega os funcionários nos selects
}

// Função para carregar as opções de funcionários no select
function carregarFuncionarios() {
    const selects = document.querySelectorAll('.funcionario-select');

    selects.forEach(select => {
        const dia = select.getAttribute('data-dia');
        select.innerHTML = '<option value="">Selecione</option>'; // Opção padrão

        funcionarios.forEach(funcionario => {
            if (funcionario.diasDisponiveis.includes(dia)) {
                const option = document.createElement('option');
                option.value = funcionario.nome;
                option.textContent = funcionario.nome;
                select.appendChild(option);
            }
        });
    });
}

// Função para filtrar por setor
function filtrarPorSetor(setor) {
    const selects = document.querySelectorAll('.funcionario-select');
    selects.forEach(select => {
        const dia = select.getAttribute('data-dia');
        select.innerHTML = '<option value="">Selecione</option>'; // Opção padrão

        funcionarios.forEach(funcionario => {
            if (funcionario.diasDisponiveis.includes(dia) && funcionario.setor === setor) {
                const option = document.createElement('option');
                option.value = funcionario.nome;
                option.textContent = funcionario.nome;
                select.appendChild(option);
            }
        });
    });
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
        funcionarios.forEach(funcionario => {
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
}

// Função para remover a última linha da tabela de escala
function removerLinhaEscala() {
    const tabela = document.getElementById('tabela-escala');
    const linhas = tabela.querySelectorAll('tr');
    
    if (linhas.length > 0) {
        tabela.removeChild(linhas[linhas.length - 1]);
    }
}

// Função para lidar com as mudanças nas células editáveis
async function handleCellEdit(e) {
    const target = e.target;
    if (target.classList.contains('editable')) {
        const nome = target.getAttribute('data-nome');
        const field = target.getAttribute('data-field');
        const funcionario = funcionarios.find(f => f.nome === nome);

        if (field === 'diasDisponiveis') {
            // Converter dias para array
            funcionario[field] = target.textContent.split(',').map(d => d.trim());
            carregarFuncionarios(); // Recarregar selects para refletir os novos dias disponíveis
        } else {
            funcionario[field] = target.textContent;
        }

        // Atualizar o funcionário no Firestore
        await atualizarFuncionario(funcionario.id, funcionario);
    }
}

function adicionarLinhasIniciais(numLinhas) {
    for (let i = 0; i < numLinhas; i++) {
        adicionarLinhaEscala();
    }
}


// Inicializar
document.getElementById('adicionar-escala').addEventListener('click', adicionarLinhaEscala);
document.getElementById('remover-escala').addEventListener('click', removerLinhaEscala);
document.getElementById('filtro-setor').addEventListener('change', function() {
    const setorSelecionado = this.value;
    filtrarPorSetor(setorSelecionado);
});

// Carregar os funcionários do Firestore e inicializar a tabela
document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionariosDoFirestore(); // Carregar funcionários do Firestore
    adicionarLinhasIniciais(4)
});
