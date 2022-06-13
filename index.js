const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')
const Choices = require('inquirer/lib/objects/choices')

operation()

function operation() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: [
            "Criar conta",
            "Consultar Saldo",
            "Depositar",
            "Sacar",
            "Sair",]
    },
    ]).then(answer => {
        const action = answer["action"]
        switch (action) {
            case "Criar conta":
                createAccount(),
                    buildAccount()
                break;
            case "Consultar Saldo":
                showAmount()
                break;
            case "Depositar":
                deposit()
                break;
            case "Sacar":
                withdraw()
                break;
            case "Sair":
                console.log(chalk.bgBlue.black('Obrigado por usar o Node Bank'))
                process.exit()
                break;

        }
        console.log(action)
    }).catch((err) => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen.black('Parabens por escolher o NodeBank')),
        console.log(chalk.green('Defina as opcoes da sua conta'))
}
function buildAccount() {
    inquirer.prompt([{
        name: "accountName",
        message: "digite um nome para sua conta"

    }]).then((answer) => {
        console.info(answer['accountName'])

        const accountName = answer["accountName"]

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Conta ja utilizada, por favor insira outro nome'))
            buildAccount()
            return
        }
        fs.writeFileSync(`accounts/${accountName}.json`, `{"balance" : 0}`, function (err) {
            console.log(err)
        })


        console.log(chalk.green(`Parabens ${accountName} sua conta foi criada com sucesso`))
        operation()




    }).catch((err) => console.log(err))
}


function deposit() {
    inquirer.prompt([{
        name: 'accountName',
        message: `Qual o nome da sua conta?`
    }]).then((answer) => {
        const accountName = answer[`accountName`]
        if (!checkAccount(accountName)) {
            return deposit()
        }
        inquirer.prompt([{
            name: "amount",
            message: "Quanto voce deseja depositar?"
        }]).then((answer) => {
            const amount = answer['amount']
            addAmount(accountName, amount)
            operation()
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        console.log(accountName)
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black("ocorreu um erro, tente novamente mais tarde"))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }

    )

    console.log(chalk.green(`Ola ${accountName}, foi depositado um total de R$${amount} na sua conta `),
        )

}

function getAccount(accountName) {
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(accountJson)

}



function showAmount() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Qual o nome da sua conta?',
        },
      ])
      .then((answer) => {
        const accountName = answer['accountName']
  
        if (!checkAccount(accountName)) {
          return showAmount()
        }
  
        const accountData = getAccount(accountName)
  
        console.log(
          chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de R$${accountData.balance}`,
          ),
        )
        operation()
      })
  }

  
function withdraw() {
    inquirer.prompt([{
        name: 'accountName',
        message: `Qual o nome da sua conta?`
    }]).then((answer) => {
        const accountName = answer[`accountName`]
        if (!checkAccount(accountName)) {
            return withdraw()
        }
        inquirer.prompt([{
            name: "amount",
            message: "Quanto voce deseja sacar?"
        }]).then((answer) => {
            const amount = answer['amount']
            sacar(accountName, amount)
            operation()
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

  function sacar(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black("ocorreu um erro, tente novamente mais tarde"))
        return deposit()
    }
    else if (amount > accountData.balance){
        console.log(chalk.bgRed.black('voce nao tem dinheiro para isso'))
        return 

    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount) 

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }

    )

    console.log(chalk.green(`Ola ${accountName}, foi retirado um total de R$${amount} na sua conta `),
        )

}
