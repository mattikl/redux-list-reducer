let NEXT_ID = 5

let TEAMS = [
  {
    id: 1,
    name: 'Blues',
    players: [
      {id: 1, name: 'Tom'},
      {id: 2, name: 'Rob'},
    ]
  },
  {
    id: 2,
    name: 'Greens',
    players: [
      {id: 3, name: 'Bob'},
      {id: 4, name: 'Jim'},
    ]
  }
]

export default class Api {
  getTeams() {
    return new Promise(resolve =>
      setTimeout(resolve(TEAMS), 200)
    )
  }

  createPlayer(name) {
    return new Promise(resolve =>
      setTimeout(() =>  resolve({id: NEXT_ID++, name}), 200)
    )
  }
}
