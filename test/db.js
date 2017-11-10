const Db = require('../lib/db')

describe('App:model', () => {
  let id, app;

  const DB = new Db;
  const App = new Mule;

  it('should get all docs in collection', async () => {

    await DB.connect('test');
    await DB.define('one', { a: { $exists: true }});
    await DB.one.$.insertMany([ { a: 1 }, { a: 2 }, { a: 3 } ]);

    App.post(ReqBody)
    App.get('/one',     DB.one.route('list', ctx => ctx.query))
    App.post('/one',    DB.one.route('create', ctx => ctx.payload))
    App.del('/one/:id', DB.one.route('remove', ctx => ctx.params.id));
    App.get('/one/:id', DB.one.route('find', ctx => ctx.params.id))


    app = chai.request(App.init())

    const res = await app.get('/one')
    res.should.be.json.and.have.status(200);
    res.body.result.should.be.an('array');
  })

  it('should create new doc', async () => {
    const res = await app.post('/one').send({ a: 1, b: 2 })
    res.should.be.json.and.have.status(200);
    id = res.body.result._id
  })

  it('should find doc by id', async () => {
    const res = await app.get('/one/' + id)
    res.should.be.json.and.have.status(200)
    res.body.result._id.should.be.eql(id)
  })

  it('should delete doc by id', async () => {
    const res = await app.del('/one/' + id)
    res.should.be.json.and.have.status(200)
  })

  it('delete doc should not exist', async () => {
    const res = await app.get('/one/' + id)
    res.should.be.json.and.have.status(200)
    should.not.exist(res.body.result)
  })

  it('should return 500 on bad request', async () => {
    try {
      const res = await app.get('/one/kkk')
    } catch (e) {
      should.exist(e)
    }
  })

  it('should return 400 on bad request', async () => {
    try {
      const res = await app.post('/one').type('json').send('{ a  0 }')
    } catch (e) {
      should.exist(e)
    }
  })
})
