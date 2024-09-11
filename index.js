function start() {
    console.log("Bem vindo ao App de tarefas")
    
    while (true) {
        let opcao = "cadastrar"
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
                return
        }
    }
}
start()
