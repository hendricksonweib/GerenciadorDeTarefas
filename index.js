const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: "Tomar 3L de água por dia",
    checked: false,
}

let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:" })

    if (meta.length == 0) {
        console.log("A meta não pode ser vazia.")
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

}

async function listarMetas() {
    const response = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if (response.length == 0) {
        console.log("Nenhuma meta selecionada!")
        return
    }

    response.forEach((response) => {
        const meta = metas.find((m) => {
            return m.value = response
        })

        meta.checked = true
    })

    console.log("meta(s) marcadas conluída(s)!")

}

async function metasRealizadas() {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if (realizadas.length == 0) {
        console.log("Não exitem metas realizadas")
        return
    }

    await select({
        message: "Metas realizadas " + realizadas.length,
        choices: [...realizadas]
    })
}

async function metasAbertas() {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        console.log("Não exitem metas abertas")
        return
    }

    await select({
        message: "Metas abertas " + metas.length,
        choices: [...abertas]
    })
}

async function metasDeletadas() {
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const itensADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itensADeletar.length == 0) {
        console.log("nenhum item para deletar!")
        return
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    console.log("Meta(s) deletada(s) com sucesso!")
}


async function start() {
    console.log("Bem vindo ao App de tarefas")

    while (true) {

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas Realizadas",
                    value: "Realizadas"
                },
                {
                    name: "Metas Abertas",
                    value: "Abertas"
                },
                {
                    name: "Deletar Metas",
                    value: "Deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })


        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                // console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "Realizadas":
                await metasRealizadas()
                break
            case "Abertas":
                await metasAbertas()
                break
            case "Deletar":
                await metasDeletadas()
                break
            case "sair":
                console.log("até a próxima")
                return
        }
    }
}
start()
