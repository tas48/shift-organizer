function extrairDadosSelecionados() {
    const dados = [];
    const selects = document.querySelectorAll('#tabela-escala select');

    selects.forEach(select => {
        const valor = select.value;
        const dia = select.getAttribute('data-dia');
        if (valor) {
            dados.push({ dia, nome: valor });
        }
    });

    return dados;
}

function criarTabelaPDF(dados) {
    // Cria o HTML da tabela
    let htmlTabela = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Escala de Funcionários</h1>
            <h3>Setor Selecionado: ${document.getElementById('filtro-setor').value}</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Segunda</th>
                        <th>Terça</th>
                        <th>Quarta</th>
                        <th>Quinta</th>
                        <th>Sexta</th>
                        <th>Sábado</th>
                        <th>Domingo</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Inicializa um array de linhas para a tabela
    const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const linhas = diasDaSemana.map(() => []);

    // Preenche as linhas com os dados
    dados.forEach(dado => {
        const indexDia = diasDaSemana.indexOf(dado.dia);
        if (indexDia >= 0) {
            linhas[indexDia].push(dado.nome);
        }
    });

    // Cria linhas da tabela com células preenchidas
    const numeroDeLinhas = Math.max(...linhas.map(linha => linha.length));
    for (let i = 0; i < numeroDeLinhas; i++) {
        htmlTabela += '<tr>';
        diasDaSemana.forEach((dia, index) => {
            htmlTabela += `<td>${linhas[index][i] || ''}</td>`;
        });
        htmlTabela += '</tr>';
    }

    // Fecha a tabela e o container
    htmlTabela += `
                </tbody>
            </table>
        </div>
    `;

    return htmlTabela;
}

document.getElementById('gerar-pdf').addEventListener('click', () => {
    // Extrai os dados dos selects
    const dados = extrairDadosSelecionados();

    // Cria o HTML da tabela para o PDF
    const htmlTabela = criarTabelaPDF(dados);

    // Configura as opções para o html2pdf
    const opcoes = {
        margin: [10, 10, 10, 10], // Margens do PDF
        filename: 'escala_funcionarios.pdf', // Nome do arquivo PDF
        image: { type: 'jpeg', quality: 0.98 }, // Configurações da imagem
        html2canvas: { scale: 2 }, // Configurações do html2canvas
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } // Orientação paisagem
    };

    // Converte o HTML em PDF
    html2pdf().from(htmlTabela).set(opcoes).save();
});
