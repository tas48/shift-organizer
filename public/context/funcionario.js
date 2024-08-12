import { adicionarFuncionario, obterFuncionarios, atualizarFuncionario, deletarFuncionario } from './database.js';

// Função para exibir a tabela de funcionários
async function exibirTabelaDisponibilidade() {
    const tabela = document.getElementById('tabela-disponibilidade');
    tabela.innerHTML = ''; // Limpar a tabela antes de recriar

    const funcionarios = await obterFuncionarios();
    funcionarios.forEach(funcionario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="editable name" contenteditable="true" data-id="${funcionario.id}" data-field="nome">${funcionario.nome || ''}</td>
            <td class="dias-container">
                <label class="label-dias"><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="Segunda" ${funcionario.diasDisponiveis.includes('Segunda') ? 'checked' : ''}> Segunda</label>
                <label class="label-dias"><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="Terça" ${funcionario.diasDisponiveis.includes('Terça') ? 'checked' : ''}> Terça</label>
                <label class="label-dias"><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="Quarta" ${funcionario.diasDisponiveis.includes('Quarta') ? 'checked' : ''}> Quarta</label>
                <label><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="Quinta" ${funcionario.diasDisponiveis.includes('Quinta') ? 'checked' : ''}> Quinta</label>
                <label><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="Sexta" ${funcionario.diasDisponiveis.includes('Sexta') ? 'checked' : ''}> Sexta</label>
                <label><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="Sábado" ${funcionario.diasDisponiveis.includes('Sábado') ? 'checked' : ''}> Sábado</label>
                <label><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="Domingo" ${funcionario.diasDisponiveis.includes('Domingo') ? 'checked' : ''}> Domingo</label>
            </td>
            <td class="editable" contenteditable="true" data-id="${funcionario.id}" data-field="telefone">${funcionario.telefone || ''}</td>
            <td>
                <select class="setor-select select" data-id="${funcionario.id}">
                    <option value="" ${!funcionario.setor ? 'selected' : ''}>Selecione o setor</option>
                    <option value="Atendimento" ${funcionario.setor === 'Atendimento' ? 'selected' : ''}>Atendimento</option>
                    <option value="Cozinha" ${funcionario.setor === 'Cozinha' ? 'selected' : ''}>Cozinha</option>
                    <option value="Entregas" ${funcionario.setor === 'Entregas' ? 'selected' : ''}>Entregas</option>
                </select>
            </td>
            <td>
                <button class="delete-btn" data-id="${funcionario.id}">
                    <img src="../assets/delete.svg">
                </button>
            </td>
        `;
        tabela.appendChild(tr);
    });

    // Adicionar eventos para os checkboxes, selects e botões de deletar
    document.querySelectorAll('.dia-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', atualizarDiasDisponiveis);
    });

    document.querySelectorAll('.setor-select').forEach(select => {
        select.addEventListener('change', atualizarSetor);
    });

    document.querySelectorAll('.editable').forEach(cell => {
        cell.addEventListener('blur', handleCellEdit);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deletarFuncionarioHandler);
    });
}

// Função para lidar com as mudanças nas células editáveis
async function handleCellEdit(e) {
    const target = e.target;
    if (target.classList.contains('editable')) {
        const id = target.getAttribute('data-id');
        const field = target.getAttribute('data-field');
        const novoValor = target.textContent;

        try {
            if (field === 'nome') {
                await atualizarFuncionario(id, { nome: novoValor });
            } else {
                await atualizarFuncionario(id, { [field]: novoValor });
            }
            console.log("Funcionário atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar funcionário: ", error);
        }
    }
}

// Função para atualizar o setor
async function atualizarSetor(event) {
    const select = event.target;
    const id = select.getAttribute('data-id');
    const setor = select.value;

    try {
        await atualizarFuncionario(id, { setor });
        console.log("Setor atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar setor: ", error);
    }
}

// Função para atualizar os dias disponíveis do funcionário
async function atualizarDiasDisponiveis(event) {
    const checkbox = event.target;
    const id = checkbox.getAttribute('data-id');
    const dia = checkbox.getAttribute('data-dia');

    const funcionarios = await obterFuncionarios();
    const funcionario = funcionarios.find(f => f.id === id);

    if (!funcionario) {
        console.error(`Funcionário não encontrado para o id: ${id}`);
        return;
    }

    if (checkbox.checked) {
        if (!funcionario.diasDisponiveis.includes(dia)) {
            funcionario.diasDisponiveis.push(dia);
        }
    } else {
        funcionario.diasDisponiveis = funcionario.diasDisponiveis.filter(d => d !== dia);
    }

    try {
        await atualizarFuncionario(id, { diasDisponiveis: funcionario.diasDisponiveis });
        console.log("Dias disponíveis atualizados com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar dias disponíveis: ", error);
    }
}

async function deletarFuncionarioHandler(event) {
    // Verifica se o evento é disparado por um elemento img
    const button = event.target.closest('button');
    const id = button.getAttribute('data-id');

    if (!id) {
        console.error("ID do funcionário não encontrado.");
        return;
    }

    try {
        await deletarFuncionario(id);
        exibirTabelaDisponibilidade(); // Recarregar a tabela após deletar
    } catch (error) {
        console.error("Erro ao deletar funcionário: ", error);
    }
}

// Função para adicionar um novo funcionário na tabela de disponibilidade
async function adicionarFuncionarioDisponibilidade() {
    const novoFuncionario = {
        nome: '', 
        telefone: '',
        setor: '',
        diasDisponiveis: []
    };

    await adicionarFuncionario(novoFuncionario);
    exibirTabelaDisponibilidade(); // Recarregar a tabela após adicionar
}

// Inicializa a tabela ao carregar a página
document.addEventListener('DOMContentLoaded', exibirTabelaDisponibilidade);

// Adicionar evento para o botão de adicionar funcionário
document.getElementById('adicionar-disponibilidade').addEventListener('click', adicionarFuncionarioDisponibilidade);
