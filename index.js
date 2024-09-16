const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require('fs').promises;

let mensagem = '';
let metas = [];

async function carregarMetas() {
    try {
        const dados = await fs.readFile('metas.json', 'utf-8');
        metas = JSON.parse(dados);
    } catch (error) {
        console.log(error);
    }
}

async function salvarMetas() {
    await fs.writeFile('metas.json', JSON.stringify(metas, null, 2));
}

const cadastrarMeta = async () => {
    const meta = await input({ message: 'Digite a meta:' });

    if (meta.length === 0) {
        mensagem = 'A meta não pode ser vazia.';
        return;
    }

    metas.push({ value: meta, checked: false });
    mensagem = 'Meta cadastrada com sucesso!';
};

async function listarMetas() {
    if (metas.length === 0) {
        mensagem = 'Não existem metas cadastradas.';
        return;
    }

    const response = await checkbox({
        message: 'Use as setas para navegar, espaço para marcar/desmarcar e Enter para finalizar.',
        choices: metas.map(meta => ({ name: meta.value, value: meta.value })),
        instructions: false,
    });

    // Resetar todas as metas como não realizadas antes de marcar
    metas.forEach(meta => (meta.checked = false));

    if (response.length === 0) {
        mensagem = 'Nenhuma meta selecionada!';
        return;
    }

    response.forEach(selectedValue => {
        const meta = metas.find(m => m.value === selectedValue);
        if (meta) {
            meta.checked = true;
        }
    });

    mensagem = 'Metas marcadas como realizadas!';
}

async function metasRealizadas() {
    if (metas.length === 0) {
        mensagem = 'Não existem metas cadastradas.';
        return;
    }

    const realizadas = metas.filter(meta => meta.checked);

    if (realizadas.length === 0) {
        mensagem = 'Não existem metas realizadas.';
        return;
    }

    await select({
        message: `Metas realizadas (${realizadas.length}):`,
        choices: realizadas.map(meta => ({ name: meta.value, value: meta.value })),
    });
}

async function metasAbertas() {
    if (metas.length === 0) {
        mensagem = 'Não existem metas cadastradas.';
        return;
    }

    const abertas = metas.filter(meta => !meta.checked);

    if (abertas.length === 0) {
        mensagem = 'Não existem metas abertas.';
        return;
    }

    await select({
        message: `Metas abertas (${abertas.length}):`,
        choices: abertas.map(meta => ({ name: meta.value, value: meta.value })),
    });
}

async function metasDeletadas() {
    if (metas.length === 0) {
        mensagem = 'Não existem metas cadastradas.';
        return;
    }

    const metasDesmarcadas = metas.map(meta => ({
        name: meta.value,
        value: meta.value,
    }));

    const itensADeletar = await checkbox({
        message: 'Selecione itens para deletar',
        choices: metasDesmarcadas,
        instructions: false,
    });

    if (itensADeletar.length === 0) {
        mensagem = 'Nenhum item selecionado para deletar!';
        return;
    }

    // Filtrar metas que não estão nos itens a deletar
    metas = metas.filter(meta => !itensADeletar.includes(meta.value));
    mensagem = 'Metas deletadas com sucesso!';
}

function mostrarMensagem() {
    console.clear(); // Isso limpa a tela para evitar o loop de mensagens múltiplas

    if (mensagem !== '') {
        console.log(mensagem);
        console.log('');
        mensagem = ''; // Resetar a mensagem para evitar repetições
    }
}

async function start() {
    await carregarMetas();

    while (true) {
        mostrarMensagem(); // Mostra a mensagem uma vez no início do loop
        await salvarMetas(); // Salva as metas após qualquer operação

        const opcao = await select({
            message: 'Menu >',
            choices: [
                { name: 'Cadastrar meta', value: 'cadastrar' },
                { name: 'Listar metas', value: 'listar' },
                { name: 'Metas Realizadas', value: 'Realizadas' },
                { name: 'Metas Abertas', value: 'Abertas' },
                { name: 'Deletar Metas', value: 'Deletar' },
                { name: 'Sair', value: 'sair' },
            ],
        });

        switch (opcao) {
            case 'cadastrar':
                await cadastrarMeta();
                break;
            case 'listar':
                await listarMetas();
                break;
            case 'Realizadas':
                await metasRealizadas();
                break;
            case 'Abertas':
                await metasAbertas();
                break;
            case 'Deletar':
                await metasDeletadas();
                break;
            case 'sair':
                console.log('Até a próxima!');
                return;
        }
    }
}

start();
