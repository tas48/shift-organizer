let funcionarios = [
    {
        nome: 'Marcelo',
        telefone: '31 993188999',
        setor: 'Cozinha',
        diasDisponiveis: ['Segunda', 'Terça', 'Quarta']
    },
    {
        nome: 'João',
        telefone: '31 993188999',
        setor: 'Atendimento',
        diasDisponiveis: ['Segunda']
    },
    {
        nome: 'Maria',
        telefone: '31 993188999',
        setor: 'Atendimento',
        diasDisponiveis: ['Terça']
    },
    {
        nome: 'José',
        telefone: '31 993188999',
        setor: 'Cozinha',
        diasDisponiveis: ['Domingo']
    }
];


// Função para salvar os funcionários no localStorage
function salvarFuncionarios() {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

// Função para carregar os funcionários do localStorage
function carregarFuncionariosDoStorage() {
    const dados = localStorage.getItem('funcionarios');
    if (dados) {
        funcionarios = JSON.parse(dados);
    }
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

// Função para atualizar os dias disponíveis do funcionário
function atualizarDiasDisponiveis(event) {
    const checkbox = event.target;
    const nome = checkbox.getAttribute('data-nome');
    const dia = checkbox.getAttribute('data-dia');

    const funcionario = funcionarios.find(f => f.nome === nome);

    if (checkbox.checked) {
        if (!funcionario.diasDisponiveis.includes(dia)) {
            funcionario.diasDisponiveis.push(dia);
        }
    } else {
        funcionario.diasDisponiveis = funcionario.diasDisponiveis.filter(d => d !== dia);
    }

    salvarFuncionarios(); // Salvar atualização no localStorage
    carregarFuncionarios(); // Recarregar selects para refletir as mudanças
    atualizarSelectsNaEscala(); // Atualizar os selects na página index.html
}

function exibirTabelaDisponibilidade() {
    const tabela = document.getElementById('tabela-disponibilidade');
    tabela.innerHTML = ''; // Limpar a tabela antes de recriar

    funcionarios.forEach(funcionario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="editable" contenteditable="true" data-nome="${funcionario.nome}" data-field="nome">${funcionario.nome}</td>
            <td>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Segunda" ${funcionario.diasDisponiveis.includes('Segunda') ? 'checked' : ''}> Segunda</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Terça" ${funcionario.diasDisponiveis.includes('Terça') ? 'checked' : ''}> Terça</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Quarta" ${funcionario.diasDisponiveis.includes('Quarta') ? 'checked' : ''}> Quarta</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Quinta" ${funcionario.diasDisponiveis.includes('Quinta') ? 'checked' : ''}> Quinta</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Sexta" ${funcionario.diasDisponiveis.includes('Sexta') ? 'checked' : ''}> Sexta</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Sábado" ${funcionario.diasDisponiveis.includes('Sábado') ? 'checked' : ''}> Sábado</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Domingo" ${funcionario.diasDisponiveis.includes('Domingo') ? 'checked' : ''}> Domingo</label>
            </td>
            <td class="editable" contenteditable="true" data-nome="${funcionario.nome}" data-field="telefone">${funcionario.telefone}</td>
            <td>
                <select class="setor-select" data-nome="${funcionario.nome}">
                    <option  value="Atendimento" ${funcionario.setor === 'Atendimento' ? 'selected' : ''}>Atendimento</option>
                    <option value="Cozinha" ${funcionario.setor === 'Cozinha' ? 'selected' : ''}>Cozinha</option>
                    <option value="Entregas" ${funcionario.setor === 'Entregas' ? 'selected' : ''}>Entregas</option>
                </select>
            </td>
        `;
        tabela.appendChild(tr);
    });

    // Adicionar eventos para os checkboxes e selects
    const checkboxes = document.querySelectorAll('.dia-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', atualizarDiasDisponiveis);
    });

    const selects = document.querySelectorAll('.setor-select');
    selects.forEach(select => {
        select.addEventListener('change', atualizarSetor);
    });
}

// Função para atualizar o setor
function atualizarSetor(event) {
    const select = event.target;
    const nome = select.getAttribute('data-nome');
    const setor = select.value;
    const funcionario = funcionarios.find(f => f.nome === nome);

    if (funcionario) {
        funcionario.setor = setor;
        salvarFuncionarios(); // Salvar atualização no localStorage
    }
}

// Função para adicionar um novo funcionário na tabela de disponibilidade
function adicionarFuncionarioDisponibilidade() {
    const novoFuncionario = {
        nome: `Funcionario ${funcionarios.length + 1}`,
        telefone: '',
        setor: '',
        diasDisponiveis: []
    };
    funcionarios.push(novoFuncionario);
    salvarFuncionarios(); // Salvar atualização no localStorage
    exibirTabelaDisponibilidade(); // Atualizar a tabela de disponibilidade
    atualizarSelectsNaEscala(); // Atualizar os selects na página index.html
}

// Função para lidar com as mudanças nas células editáveis
function handleCellEdit(e) {
    const target = e.target;
    if (target.classList.contains('editable')) {
        const nome = target.getAttribute('data-nome');
        const field = target.getAttribute('data-field');
        const funcionario = funcionarios.find(f => f.nome === nome);

        if (field === 'diasDisponiveis') {
            funcionario[field] = target.textContent.split(',').map(d => d.trim());
        } else {
            funcionario[field] = target.textContent;
        }
        salvarFuncionarios(); // Salvar atualização no localStorage
    }
}

// Função para atualizar os selects na página index.html
function atualizarSelectsNaEscala() {
    // Supondo que os selects na página index.html têm a classe 'funcionario-select'
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



document.getElementById('adicionar-disponibilidade').addEventListener('click', adicionarFuncionarioDisponibilidade);
document.getElementById('tabela-disponibilidade').addEventListener('blur', handleCellEdit, true);

document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionariosDoStorage();
    exibirTabelaDisponibilidade();
});
