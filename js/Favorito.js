import { GithubUser } from "./GithubUser.js";

export class Favorito {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save () {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username){
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error('Usuário já esta na lista!')
      }

      const user = await GithubUser.search(username)
      
      if(user.login === undefined)
      {
        throw new Error('Usuário não encontrados!')
      }

      this.entries = [user,...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user){
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }

}

export class FavoritosView extends Favorito{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () =>{
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update(){
  this.removeAllTr()

  this.entries.forEach( user =>{
    const row = this.creatRow()

    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `Imagem de perfil de ${user.name}`
    row.querySelector('.user a').href = `https://github.com/${user.login}`
    row.querySelector('.user p').textContent = user.name
    row.querySelector('.user span').textContent = user.login
    row.querySelector('.repositorios').textContent = user.public_repos
    row.querySelector('.seguidores').textContent = user.followers

    row.querySelector('.remove').onclick = () =>{
      const isOk = confirm("Tem certeza que deseja deletar essa linha?")
      if(isOk){
        this.delete(user)
      }
    }

    this.tbody.append(row)

  })
  }

  creatRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
  <tr>
  <td class="user">
    <img src="https://github.com/JoaoPedroOM.png" alt="Imagem de perfil">
    <a href="https://github.com/JoaoPedroOM" target="_blank">
      <p>João Pedro</p>
      <span>JoaoPedroOM</span>
    </a>
  </td>
  <td class="repositorios">
    76
  </td>
  <td class="seguidores">
    9000
  </td>
  <td>
    <button class="remove">&times;</button>
  </td>
</tr>
  `
    return tr

  }

  removeAllTr(){
    this.tbody.querySelectorAll('tr').forEach((tr) =>{
      tr.remove()
    })
  }

}