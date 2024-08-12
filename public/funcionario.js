// Exemplo de array de funcionários
let funcionarios = [
    {
        nome: "João Silva",
        telefone: "1234-5678",
        setor: "Atendimento",
        diasDisponiveis: ["Segunda", "Quarta", "Sexta"]
    },
    {
        nome: "Maria Oliveira",
        telefone: "9876-5432",
        setor: "Cozinha",
        diasDisponiveis: ["Terça", "Quinta", "Sábado"]
    },
    {
        nome: "Carlos Santos",
        telefone: "1357-2468",
        setor: "Entregas",
        diasDisponiveis: ["Segunda", "Terça", "Domingo"]
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

// Função para atualizar o nome do funcionário na tabela e no array
function atualizarNomeFuncionario(nomeAntigo, novoNome) {
    const funcionario = funcionarios.find(f => f.nome === nomeAntigo);
    if (funcionario) {
        funcionario.nome = novoNome;
        salvarFuncionarios();
        exibirTabelaDisponibilidade(); // Atualizar a tabela para refletir mudanças
    } else {
        console.error(`Funcionário não encontrado para o nome: ${nomeAntigo}`);
    }
}

// Função para atualizar os dias disponíveis do funcionário
function atualizarDiasDisponiveis(event) {
    const checkbox = event.target;
    const nome = checkbox.getAttribute('data-nome');
    const dia = checkbox.getAttribute('data-dia');

    const funcionario = funcionarios.find(f => f.nome === nome);

    if (!funcionario) {
        console.error(`Funcionário não encontrado para o nome: ${nome}`);
        return;
    }

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

// Função para exibir a tabela de disponibilidade dos funcionários
function exibirTabelaDisponibilidade() {
    const tabela = document.getElementById('tabela-disponibilidade');
    tabela.innerHTML = ''; // Limpar a tabela antes de recriar

    funcionarios.forEach(funcionario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="editable" contenteditable="true" data-nome="${funcionario.nome}" data-field="nome">${funcionario.nome}</td>
            <td>
                <label class="label-dias"><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Segunda" ${funcionario.diasDisponiveis.includes('Segunda') ? 'checked' : ''}> Segunda</label>
                <label class="label-dias"><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Terça" ${funcionario.diasDisponiveis.includes('Terça') ? 'checked' : ''}> Terça</label>
                <label class="label-dias"><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Quarta" ${funcionario.diasDisponiveis.includes('Quarta') ? 'checked' : ''}> Quarta</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Quinta" ${funcionario.diasDisponiveis.includes('Quinta') ? 'checked' : ''}> Quinta</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Sexta" ${funcionario.diasDisponiveis.includes('Sexta') ? 'checked' : ''}> Sexta</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Sábado" ${funcionario.diasDisponiveis.includes('Sábado') ? 'checked' : ''}> Sábado</label>
                <label><input type="checkbox" class="dia-checkbox" data-nome="${funcionario.nome}" data-dia="Domingo" ${funcionario.diasDisponiveis.includes('Domingo') ? 'checked' : ''}> Domingo</label>
            </td>
            <td class="editable" contenteditable="true" data-nome="${funcionario.nome}" data-field="telefone">${funcionario.telefone}</td>
            <td>
                <select class="setor-select select" data-nome="${funcionario.nome}">
                    <option value="Atendimento" ${funcionario.setor === 'Atendimento' ? 'selected' : ''}>Atendimento</option>
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

    const cellsEditables = document.querySelectorAll('.editable');
    cellsEditables.forEach(cell => {
        cell.addEventListener('blur', handleCellEdit);
    });
}

// Função para lidar com as mudanças nas células editáveis
function handleCellEdit(e) {
    const target = e.target;
    if (target.classList.contains('editable')) {
        const nomeAntigo = target.getAttribute('data-nome');
        const field = target.getAttribute('data-field');
        const novoValor = target.textContent;

        if (field === 'nome') {
            atualizarNomeFuncionario(nomeAntigo, novoValor);
        } else {
            const funcionario = funcionarios.find(f => f.nome === nomeAntigo);
            if (funcionario) {
                funcionario[field] = novoValor;
                salvarFuncionarios(); // Salvar atualização no localStorage
            }
        }
    }
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
        setor: 'Atendimento', // Define o setor padrão
        diasDisponiveis: [] // Dias disponíveis vazios por padrão
    };
    funcionarios.push(novoFuncionario);
    salvarFuncionarios(); // Salvar atualização no localStorage
    exibirTabelaDisponibilidade(); // Atualizar a tabela de disponibilidade
    atualizarSelectsNaEscala(); // Atualizar os selects na página index.html
}

// Função para atualizar os selects na escala de trabalho na página index.html
function atualizarSelectsNaEscala() {
    if (document.getElementById('tabela-escala')) {
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
}

// Executar funções iniciais
document.getElementById('adicionar-disponibilidade').addEventListener('click', adicionarFuncionarioDisponibilidade);

carregarFuncionariosDoStorage();
exibirTabelaDisponibilidade();
atualizarSelectsNaEscala();
