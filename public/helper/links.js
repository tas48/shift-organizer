import { obterFuncionarios } from '../context/database.js';

document.addEventListener('DOMContentLoaded', async () => {
    const listaLinks = document.getElementById('lista-links');
    listaLinks.innerHTML = ''; // Limpa a tabela antes de gerar novos links

    const funcionarios = await obterFuncionarios();
    const baseUrl = 'https://shift-organizer-f2b19.web.app/public/pages/editor.html?id=';

    // Cria o cabeçalho da tabela
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Nome do Funcionário</th>
        <th>Ação</th>
    `;
    listaLinks.appendChild(headerRow);

    // Popula a tabela com os funcionários e seus botões de cópia
    funcionarios.forEach(funcionario => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${funcionario.nome}</td>
            <td><button class="copy-btn" data-link="${baseUrl}${funcionario.id}">Pegar Link</button></td>
        `;

        listaLinks.appendChild(row);
    });

    // Adiciona funcionalidade de cópia para os botões
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const link = event.target.getAttribute('data-link');
            navigator.clipboard.writeText(link).then(() => {
                alert('Link copiado para a área de transferência!');
            }).catch(err => {
                console.error('Erro ao copiar o link: ', err);
            });
        });
    });
});
