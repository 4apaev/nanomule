const Db = require('../lib/db')

describe('App:model', () => {
  let id, app, routeId, collection;
  const name = 'one';
  const route = '/one';
  const regex = /^\/one\/\w+$/;
  const DB = new Db;
  const App = new Mule;

  it('should get all docs in collection', async () => {
    await DB.connect('test');
    collection = await DB.define(name, { a: { $exists: true } });
    await collection.fill([ { a: 1 }, { a: 2 }, { a: 3 } ]);

    App.post(require('../lib/body'));
    App.post(route, collection.route('create', ctx => ctx.payload));
    App.get(route, collection.route('list', ctx => ctx.query));
    App.get(regex, collection.route('find', ctx => ctx.pathname.split('/').pop()));
    App.del(regex, collection.route('remove', ctx => ctx.pathname.split('/').pop()));

    app = App.init()
    const res = await chai.request(app).get(route)
    common(res, 'array')
  })

  it('should create new doc', async () => {
    const res = await chai.request(app).post(route).send({ a: 1, b: 2 })
    common(res, 'object')
    id = res.body.result._id
    routeId = route + '/' + id
  })

  it('should find doc by id', async () => {
    const res = await chai.request(app).get(routeId)
    common(res, 'object')
    res.body.result._id.should.be.eql(id)
  })

  it('should delete doc by id', async () => {
    const res = await chai.request(app).del(routeId)
    common(res, 'object')
  })

  it('delete doc should not exist', async () => {
    const res = await chai.request(app).get(routeId)
    common(res)
    res.body.ok.should.be.eql(true);
  })

  it('should return 400 on bad request', done => {
    chai.request(app).post(route).send('{ a: 0 }').end((e, res) => {
      res.should.be.json;
      res.should.have.status(400);
      res.body.ok.should.be.eql(false)
      done();
    })
  })

  it('should return 500 on bad request', done => {
    chai.request(app).get(route + '/kkk').end((e, res) => {
      res.should.be.json;
      res.should.have.status(500);
      res.body.ok.should.be.eql(false)
      done();
    })
  })

})

function common(res, type, code = 200) {
  res.should.be.json;
  res.should.have.status(code);

  if (type)
    res.body.result.should.be.an(type);
  else
    should.not.exist(res.body.result)
}

/*
 (async (schema, docs) => {

 const Doggo = new Db

 await Doggo.connect('doggo')
 await Doggo.define('borks', schema)
 const { borks } = Doggo

 await borks.index({ loc: '2d' }) //2dsphere
 await borks.fill(docs)

 const res = await borks.near(...docs[ 6 ].loc, { maxDistance: 500/111300 })

 })({
 'loc.0': { $type: 'double', $gte: -180, $lte: 180 },
 'loc.1': { $type: 'double', $gte: -90,  $lte: 90 },
 type  : { $inn: [ 'inspector','park','bork','vet' ] }
 },[

 { type: 'bork', loc : [ 32.095799        , 34.787543         ] },
 { type: 'ver',  loc : [ 32.096381        , 34.79059          ] },
 { type: 'bork', loc : [ 32.085536        , 34.769969         ] },
 { type: 'ver',  loc : [ 32.093825        , 34.785762         ] },
 { type: 'bork', loc : [ 32.0976160020075 , 34.7853898126587  ] },
 { type: 'bork', loc : [ 32.0953437563893 , 34.789423855017   ] },
 { type: 'bork', loc : [ 32.0973433355176 , 34.7903679925903  ] },
 { type: 'ver',  loc : [ 32.0961528285009 , 34.7904364995361  ] },
 { type: 'park', loc : [ 32.0969708361897 , 34.7800939015747  ] },
 { type: 'bork', loc : [ 32.095625664109  , 34.7772614888549  ] },
 { type: 'bork', loc : [ 32.0979887910837 , 34.7910373143554  ] },
 { type: 'park', loc : [ 32.0968254131359 , 34.798890822351   ] },
 { type: 'ver',  loc : [ 32.0953348134872 , 34.7839133672119  ] },
 { type: 'bork', loc : [ 32.0997883621597 , 34.7872607640625  ] },
 { type: 'park', loc : [ 32.0967345236098 , 34.7968308858276  ] },
 { type: 'bork', loc : [ 32.0958256233744 , 34.7878615788818  ] },
 { type: 'ver',  loc : [ 32.095425704406  , 34.7859518460632  ] },
 { type: 'bork', loc : [ 32.0966072781212 , 34.787003271997   ] },
 { type: 'bork', loc : [ 32.096934480448  , 34.7840206555725  ] },
 { type: 'ver',  loc : [ 32.0955165952343 , 34.7900073460937  ] },
 { type: 'bork', loc : [ 32.0972798594102 , 34.791852705896   ] },
 { type: 'ver',  loc : [ 32.0962437186058 , 34.7791068486572  ] },
 { type: 'bork', loc : [ 32.0992407691584 , 34.7762824825645  ] },
 { type: 'bork', loc : [ 32.0995225186645 , 34.777092509687   ] },
 { type: 'ver',  loc : [ 32.0981046736226 , 34.788078837812   ] },
 { type: 'bork', loc : [ 32.0982319170253 , 34.788980060041   ] },
 { type: 'bork', loc : [ 32.0981046736226 , 34.7872849039436  ] }

 ])
 */
