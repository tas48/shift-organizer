import { obterFuncionarioPorId, atualizarFuncionario } from '../context/database.js';

// Função para exibir o funcionário específico na tabela
async function exibirFuncionario(id) {
    const tabela = document.getElementById('tabela-disponibilidade');
    tabela.innerHTML = ''; // Limpar a tabela antes de recriar

    const funcionario = await obterFuncionarioPorId(id);

    if (!funcionario) {
        console.error('Funcionário não encontrado');
        return;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="editable name" contenteditable="true" data-id="${funcionario.id}" data-field="nome">${funcionario.nome || ''}</td>
        <td class="dias-container">
            ${['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(dia => `
                <label class="label-dias"><input type="checkbox" class="dia-checkbox" data-id="${funcionario.id}" data-dia="${dia}" ${funcionario.diasDisponiveis.includes(dia) ? 'checked' : ''}> ${dia}</label>
            `).join('')}
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
    `;
    tabela.appendChild(tr);

    // Adicionar eventos para os checkboxes, selects e células editáveis
    document.querySelectorAll('.dia-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', atualizarDiasDisponiveis);
    });

    document.querySelectorAll('.setor-select').forEach(select => {
        select.addEventListener('change', atualizarSetor);
    });

    document.querySelectorAll('.editable').forEach(cell => {
        cell.addEventListener('blur', handleCellEdit);
    });
}

// Função para lidar com as mudanças nas células editáveis
async function handleCellEdit(e) {
    const target = e.target;
    const id = target.getAttribute('data-id');
    const field = target.getAttribute('data-field');
    const novoValor = target.textContent;

    try {
        await atualizarFuncionario(id, { [field]: novoValor });
        console.log("Funcionário atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar funcionário: ", error);
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

    const funcionario = await obterFuncionarioPorId(id);

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

// Função principal para inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        exibirFuncionario(id);
    } else {
        console.error('ID do funcionário não fornecido na URL');
    }
});

// Função para salvar as edições e enviar ao backend
document.getElementById('salvar-edicoes').addEventListener('click', () => {
    alert('Edições salvas com sucesso!');
    // Aqui você pode adicionar qualquer lógica adicional de salvamento ou navegação
});
