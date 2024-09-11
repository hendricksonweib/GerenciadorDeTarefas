const { select } = require('@inquirer/prompts')

async function start() {
    console.log("Bem vindo ao App de tarefas")

    while (true) {

        const opcao = await select ({
            message:"Menu >",
            choices:[
                {
                    name:"Cadastrar meta",
                    value:"cadastrar"
                },
                {
                    name:"Listar metas",
                    value:"listar"
                },
                {

                    name:"Sair",
                    value:"sair"
                }
            ]
        })
        switch (opcao) {
            case "cadastrar":
                console.log("vamos cadastrar")
                break
            case "listar":
                console.log("listar tarefa")
                break
            case "Tarefas abertas":
                console.log("tarefas em aberto")
                break
            case "sair":
                console.log("até a próxima")
                return
        }
    }
}
start()
