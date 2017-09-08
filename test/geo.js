const Db = require('../lib/db')

describe('App:geo', () => {

  const App = new Mule;
  const Doggo = new Db;

  it('should get', async () => {

    await Doggo.connect('doggo');
    await Doggo.define('borks', {
      'loc.0': { $type: 'double', $gte: -180, $lte: 180 },
      'loc.1': { $type: 'double', $gte: -90, $lte: 90 },
       type  : { $inn: [ 'inspector', 'park', 'bork', 'vet' ] },
    })

    await Doggo.borks.index({ loc: '2d' }) //2dsphere
    await Doggo.borks.fill([
      { type: 'bork', loc: [ 32.095799, 34.787543 ] },
      { type: 'vet',  loc: [ 32.096381, 34.79059  ] },
      { type: 'park', loc: [ 32.085536, 34.769969 ] },
      { type: 'bork', loc: [ 32.093825, 34.785762 ] },
    ])

    App.get('/borks', async ctx => {
      const result = await Doggo.borks.list()
      ctx.code = 200
      ctx.type = 'json'
      ctx.body = { ok: true, result }
    });

    //const res = await Doggo.borks.near(...docs[ 6 ].loc, { maxDistance: 500/111300 })

    const res = await chai.request(App.init()).get('/borks')
    res.should.be.json;
    res.should.have.status(200)
    res.body.result.should.be.an('array')
  })

})
