
const itens = require('../../app/api/itens/route');

test('Espera criar um leilão normalmente', () => {
  const req = {
    body: JSON.stringify({
       name : 'Item1',
       description : 'Descricao Item1',
       minimumValue : 1000,
    })
  }

  const json = jest.fn();
  const status = jest.fn(()=> {
    return(
      json
    )
  })
  const res = { status }

  itens.POST(req, res);

  console.log('a',json.mock)

})
